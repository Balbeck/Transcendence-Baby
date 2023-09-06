export const toRadians = (degree: number) => Math.PI / 180 * degree;
export const toDegrees = (radians: number) => 180 / Math.PI * radians;

export const map = (n: number, in_min: number, in_max: number, out_min: number, out_max: number) =>
	(n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;


export function assertUnreachable(_data: never): never {
	throw new Error('Reached unreachable code');
}
