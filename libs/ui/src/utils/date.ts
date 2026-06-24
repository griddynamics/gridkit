export interface DateFormat {
  date: Date | number | string;
  locale?: string;
  format?: {
    day?: 'numeric' | '2-digit';
    month?: 'short' | 'long' | 'narrow';
  };
}
export const formatDate = ({ date, locale = 'en-US', format = { day: 'numeric', month: 'short' } }: DateFormat) => {
  return new Date(date).toLocaleDateString(locale, format);
};
