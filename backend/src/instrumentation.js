import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { SimpleLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';

const isProd = process.env.NODE_ENV === 'production';
const otlp = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://lgtm:4318';

// Set up log exporter only in production
if (isProd) {
  const loggerProvider = new LoggerProvider({
    processors: [
      new SimpleLogRecordProcessor(new OTLPLogExporter({
        url: `${otlp}/v1/logs`,
      }))
    ]
  });
  logs.setGlobalLoggerProvider(loggerProvider);
}

const sdk = new NodeSDK({
  traceExporter: isProd ? new OTLPTraceExporter({ url: `${otlp}/v1/traces` }) : undefined,
  metricReader: isProd
    ? new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({ url: `${otlp}/v1/metrics` }),
        exportIntervalMillis: 10000,
      })
    : undefined,
  instrumentations: [getNodeAutoInstrumentations()],
});

if (process.env.OTEL_SDK_DISABLED !== 'true') {
  sdk.start();
  console.log(`🔭 OpenTelemetry initialized! (isProd: ${isProd})`);
}

// Export logging function
export function otelLog(message, level = 'INFO') {
  if (!isProd) {
    console.log(`[${level}] ${message}`);
    return;
  }

  const logger = logs.getLogger('backend_service');
  const severityMap = {
    'DEBUG': SeverityNumber.DEBUG,
    'INFO': SeverityNumber.INFO,
    'WARN': SeverityNumber.WARN,
    'ERROR': SeverityNumber.ERROR,
  };

  logger.emit({
    severityNumber: severityMap[level] || SeverityNumber.INFO,
    severityText: level,
    body: message,
  });
}
