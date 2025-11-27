export function getCorGravidade(gravidade: string | undefined): string {
	if (!gravidade) return '#999';
	const g = String(gravidade).toLowerCase();
	if (g.includes('alta')) return '#e74c3c';
	if (g.includes('media') || g.includes('média')) return '#f39c12';
	if (g.includes('baixa')) return '#2ecc71';
	return '#999';
}

export function getCorStatus(status: string | undefined): string {
	if (!status) return '#999';
	const s = String(status).toLowerCase();
	if (s.includes('aberta')) return '#f1c40f';
	if (s.includes('despach')) return '#3498db';
	if (s.includes('atend')) return '#9b59b6';
	if (s.includes('concl')) return '#2ecc71';
	if (s.includes('cancel')) return '#95a5a6';
	return '#999';
}

export default {
	getCorGravidade,
	getCorStatus,
};
