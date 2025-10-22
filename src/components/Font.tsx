export const swapFont = (): string => {
  const fonts = ["font-mono", "font-sans", "font-serif"];
  return fonts[Math.floor(Math.random() * fonts.length)];
};
