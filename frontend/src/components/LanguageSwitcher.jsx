import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, languages, changeLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
        {Object.entries(languages).map(([key, value]) => (
          <option key={key} value={key}>
            {value.name}
          </option>
        ))}
      </select>
    </div>
  );
}
