import * as PIXI from 'pixi.js';
import { ShapeData, ShapeType } from '../model/GameModel';

export class PixiView {
    public app: PIXI.Application;
    private shapes: Map<string, PIXI.Graphics> = new Map();
    private readonly interactionLayer: PIXI.Container;

    constructor() {
        this.app = new PIXI.Application();
        this.interactionLayer = new PIXI.Container();
    }

    public async init(width: number, height: number, container: HTMLElement) {
        await this.app.init({ width, height, background: 0xFFFFFF });
        container.appendChild(this.app.canvas);
        this.app.stage.addChild(this.interactionLayer);
    }

    public addShape(data: ShapeData, onClick: (id: string, type: ShapeType) => void) {
        const graphics = new PIXI.Graphics();
        this.drawShape(graphics, data);
        
        graphics.x = data.x;
        graphics.y = data.y;
        graphics.eventMode = 'static';
        graphics.cursor = 'pointer';
        graphics.on('pointerdown', (e) => {
            e.stopPropagation();
            onClick(data.id, data.type);
        });

        this.interactionLayer.addChild(graphics);
        this.shapes.set(data.id, graphics);
    }

    public removeShape(id: string) {
        const graphics = this.shapes.get(id);
        if (graphics) {
            this.interactionLayer.removeChild(graphics);
            graphics.destroy();
            this.shapes.delete(id);
        }
    }

    public updateShapePosition(id: string, y: number) {
        const graphics = this.shapes.get(id);
        if (graphics) {
            graphics.y = y;
        }
    }

    private drawShape(graphics: PIXI.Graphics, data: ShapeData) {
        graphics.fill(data.color);
        switch (data.type) {
            case ShapeType.Triangle:
            case ShapeType.Rectangle:
            case ShapeType.Pentagon:
            case ShapeType.Hexagon:
            case ShapeType.Random:
                if (data.points) {
                    graphics.poly(data.points);
                }
                break;
            case ShapeType.Circle:
                if (data.radius !== undefined) {
                    graphics.circle(0, 0, data.radius);
                }
                break;
            case ShapeType.Ellipse:
                if (data.radiusX !== undefined && data.radiusY !== undefined) {
                    graphics.ellipse(0, 0, data.radiusX, data.radiusY);
                }
                break;
        }
        graphics.fill();
    }

    public onBackgroundClick(callback: (x: number, y: number) => void) {
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
        this.app.stage.on('pointerdown', (e) => {
            callback(e.global.x, e.global.y);
        });
    }
}
