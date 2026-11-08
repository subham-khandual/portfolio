// Visitor-count storage helper (kept separate so PortfolioContext only
// exports components, per Vite fast-refresh rules).
export const readStoredVisitorCount = () => {
  try {
    const stored = localStorage.getItem('visitorCount');
    const parsed = stored ? parseInt(stored, 10) : Number.NaN;
    return Number.isFinite(parsed) ? parsed + 1 : 1349;
  } catch {
    return 1349;
  }
};
