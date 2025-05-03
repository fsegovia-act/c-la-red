export function getPaginationParams(url: string) {
  const { searchParams } = new URL(url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;
    
  return { page, limit, skip };
}