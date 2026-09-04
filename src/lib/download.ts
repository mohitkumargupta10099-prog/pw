export async function downloadFile(url: string, filename: string) {
  if (!url) return;
  const safe = filename.replace(/[^\w\-. ]+/g, "_") || "file";
  const name = safe.toLowerCase().endsWith(".pdf") ? safe : `${safe}.pdf`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("bad response");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
  } catch {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
