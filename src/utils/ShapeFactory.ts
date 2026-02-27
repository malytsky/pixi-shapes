import { ShapeData, ShapeType } from '../model/GameModel';

export class ShapeFactory {
    private static idCounter = 0;

    public static createRandomShape(x: number, y: number): ShapeData {
        const types = [
            ShapeType.Triangle,
            ShapeType.Rectangle,
            ShapeType.Pentagon,
            ShapeType.Hexagon,
            ShapeType.Circle,
            ShapeType.Ellipse,
            ShapeType.Random
        ];
        const type = types[Math.floor(Math.random() * types.length)];
        return this.createShape(type, x, y);
    }

    public static createShape(type: ShapeType, x: number, y: number): ShapeData {
        const id = (this.idCounter++).toString();
        const color = Math.floor(Math.random() * 0xFFFFFF);
        const baseSize = 40 + Math.random() * 40;

        let area = 0;
        let points: { x: number; y: number }[] | undefined;
        let radius: number | undefined;
        let radiusX: number | undefined;
        let radiusY: number | undefined;

        switch (type) {
            case ShapeType.Triangle:
            case ShapeType.Rectangle:
            case ShapeType.Pentagon:
            case ShapeType.Hexagon:
                const sides = type as number;
                points = this.generatePolygonPoints(sides, baseSize);
                area = this.calculatePolygonArea(points);
                break;
            case ShapeType.Circle:
                radius = baseSize / 2;
                area = Math.PI * radius * radius;
                break;
            case ShapeType.Ellipse:
                radiusX = baseSize / 2;
                radiusY = baseSize / 3;
                area = Math.PI * radiusX * radiusY;
                break;
            case ShapeType.Random:
                points = this.generateRandomPolygonPoints(baseSize);
                area = this.calculatePolygonArea(points);
                break;
        }

        return {
            id,
            type,
            x,
            y,
            color,
            area,
            points,
            radius,
            radiusX,
            radiusY
        };
    }

    private static generatePolygonPoints(sides: number, size: number): { x: number; y: number }[] {
        const points = [];
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
            points.push({
                x: Math.cos(angle) * size / 2,
                y: Math.sin(angle) * size / 2
            });
        }
        return points;
    }

    private static generateRandomPolygonPoints(size: number): { x: number; y: number }[] {
        const points = [];
        const numPoints = 8 + Math.floor(Math.random() * 8);
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const dist = (0.5 + Math.random() * 0.5) * size / 2;
            points.push({
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist
            });
        }
        return points;
    }

    private static calculatePolygonArea(points: { x: number; y: number }[]): number {
        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            area += (p1.x * p2.y) - (p2.x * p1.y);
        }
        return Math.abs(area) / 2;
    }
}
