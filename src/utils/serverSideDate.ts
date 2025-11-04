async function _serverSideDate(url: string): Promise<Date | null> {
  const res: Response = await fetch(url);

  const headerDate = res.headers.get('date');
  if (!headerDate) return null;

  const d = new Date(headerDate);
  if (isNaN(d.getTime())) return null;

  return d;
}

export async function serverSideDate(
  url: string = '/robots.txt',
): Promise<Date> {
  try {
    return (await _serverSideDate(url)) || new Date();
  } catch (e) {
    console.warn(e);
    return new Date();
  }
}
