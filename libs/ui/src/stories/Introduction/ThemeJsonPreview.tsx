import { useEffect, useState } from 'react';

export const ThemeJsonPreview = (props: { themeKey?: string }) => {
  const { themeKey } = props;
  const [themeJson, setThemeJson] = useState<string>('Loading theme...');

  useEffect(() => {
    fetch('/defaultTheme.json')
      .then((res) => res.json())
      .then((data) => {
        const themeData = themeKey ? { [themeKey]: data[themeKey] } : data;
        setThemeJson(JSON.stringify(themeData, null, 2));
      })
      .catch((err) => {
        setThemeJson(`Failed to load theme.json: ${err.message}`);
      });
  }, []);

  return (
    <pre
      style={{
        background: '#f4f4f4',
        padding: '1rem',
        borderRadius: '6px',
        maxHeight: '800px',
        overflow: 'auto',
        fontSize: '12px',
      }}
    >
      {themeJson}
    </pre>
  );
};

export const ThemeDownloadLink = () => {
  // Since we are using <a/> tag, default storybook styles for links are not applied. Added for consistency across docs
  const styles = {
    fontFamily: `"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif`,
    margin: 0,
    WebkitFontSmoothing: 'antialiased',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    fontSize: '14px',
    lineHeight: '24px',
    color: 'rgb(2, 156, 253)',
    textDecoration: 'none',
  };
  return (
    <a href="/defaultTheme.json" download css={styles}>
      Download Theme JSON
    </a>
  );
};
