export const formatPrice = (
  price: number,
  decimalPlaces: number = 2,
  decimalSeparator: string = ",",
  thousandsSeparator: string = "."
): string => {
  if (isNaN(price) || price === null || price === undefined) {
    return "0" + decimalSeparator + "0".repeat(decimalPlaces);
  }
  
  const fixedPrice = price.toFixed(decimalPlaces);
  const [integerPart, decimalPart] = fixedPrice.split(".");

  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandsSeparator
  );

  return (
    formattedIntegerPart +
    decimalSeparator +
    (decimalPart || "0".repeat(decimalPlaces))
  );
};

export const base64ToFile = (base64String: string, fileName?: string): File => {
  const matches: RegExpMatchArray | null = base64String.match(
    /^data:([A-Za-z-+\/]+);base64,(.+)$/
  );

  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string format");
  }

  const mimeType: string = matches[1];
  const base64Data: string = matches[2];

  const byteCharacters: string = atob(base64Data);
  const byteArrays: number[] = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const blob: Blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });

  const currentDate: Date = new Date();
  return new File(
    [blob],
    fileName || `image_${currentDate.getTime()}.${mimeType.split("/")[1]}`,
    {
      type: mimeType,
      lastModified: currentDate.getTime(),
    }
  );
};
