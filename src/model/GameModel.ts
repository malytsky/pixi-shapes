export enum ShapeType {
    Triangle = 3,
    Rectangle = 4,
    Pentagon = 5,
    Hexagon = 6,
    Circle = 7,
    Ellipse = 8,
    Random = 9
}

export interface ShapeData {
    id: string;
    type: ShapeType;
    x: number;
    y: number;
    color: number;
    area: number;
    points?: { x: number; y: number }[];
    radius?: number;
    radiusX?: number;
    radiusY?: number;
}

export class GameModel {
    public gravity: number = 2;
    public shapesPerSecond: number = 1;
    public shapes: ShapeData[] = [];
    public totalArea: number = 0;

    constructor() {}

    public addShape(shape: ShapeData) {
        this.shapes.push(shape);
        this.totalArea += shape.area;
    }

    public removeShape(id: string) {
        const index = this.shapes.findIndex(s => s.id === id);
        if (index !== -1) {
            this.totalArea -= this.shapes[index].area;
            this.shapes.splice(index, 1);
        }
    }

    public updateShapePosition(id: string, newY: number) {
        const shape = this.shapes.find(s => s.id === id);
        if (shape) {
            shape.y = newY;
        }
    }
}
