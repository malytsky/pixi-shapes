import { GameModel, ShapeType } from '../model/GameModel';
import { PixiView } from '../view/PixiView';
import { HtmlView } from '../view/HtmlView';
import { ShapeFactory } from '../utils/ShapeFactory';

export class GameController {
    private model: GameModel;
    private pixiView: PixiView;
    private htmlView: HtmlView;
    private lastGenerationTime: number = 0;

    constructor(model: GameModel, pixiView: PixiView, htmlView: HtmlView) {
        this.model = model;
        this.pixiView = pixiView;
        this.htmlView = htmlView;
    }

    public async init() {
        const container = document.getElementById('canvas-container')!;
        const width = container.clientWidth;
        const height = container.clientHeight;

        await this.pixiView.init(width, height, container);

        this.pixiView.onBackgroundClick((x, y) => {
            this.createShape(x, y);
        });

        this.htmlView.onShapesPerSecChange((delta) => {
            this.model.shapesPerSecond = Math.max(1, this.model.shapesPerSecond + delta);
            this.htmlView.updateControls(this.model.shapesPerSecond, this.model.gravity);
        });

        this.htmlView.onGravityChange((delta) => {
            this.model.gravity = Math.max(0, this.model.gravity + delta);
            this.htmlView.updateControls(this.model.shapesPerSecond, this.model.gravity);
        });

        this.htmlView.updateControls(this.model.shapesPerSecond, this.model.gravity);
        this.htmlView.updateStats(this.model.shapes.length, this.model.totalArea);

        this.pixiView.app.ticker.add((ticker) => {
            this.update(ticker.deltaTime, ticker.lastTime);
        });
    }

    private update(deltaTime: number, currentTime: number) {
        // Handle movement and gravity
        const shapesToRemove: string[] = [];
        const height = this.pixiView.app.screen.height;

        // Note: we need a stable way to iterate and update
        for (const shape of this.model.shapes) {
            const newY = shape.y + this.model.gravity * deltaTime;
            this.model.updateShapePosition(shape.id, newY);
            this.pixiView.updateShapePosition(shape.id, newY);

            // Check if out of bounds (bottom)
            // Giving some margin for shape size
            if (newY > height + 100) {
                shapesToRemove.push(shape.id);
            }
        }

        for (const id of shapesToRemove) {
            this.removeShape(id);
        }

        // Handle generation
        const generationInterval = 1000 / this.model.shapesPerSecond;
        if (currentTime - this.lastGenerationTime > generationInterval) {
            this.generateRandomShape();
            this.lastGenerationTime = currentTime;
        }

        this.htmlView.updateStats(this.model.shapes.length, this.model.totalArea);
    }

    private generateRandomShape() {
        const width = this.pixiView.app.screen.width;
        const x = Math.random() * width;
        const y = -100; // Start above screen
        this.createShape(x, y);
    }

    private createShape(x: number, y: number) {
        const shapeData = ShapeFactory.createRandomShape(x, y);
        this.model.addShape(shapeData);
        this.pixiView.addShape(shapeData, (id, type) => {
            this.onShapeClick(id, type);
        });
    }

    private removeShape(id: string) {
        this.model.removeShape(id);
        this.pixiView.removeShape(id);
    }

    private onShapeClick(id: string, type: ShapeType) {
        // Requirement: "If you click a shape, it will disappear."
        // Image requirement: "Click on a shape to change the color of all shapes of the same type"
        // I will implement both: Disappear as per text, but maybe user wants the color change too?
        // Let's stick to text: "disappear".
        this.removeShape(id);
        
        // If I were to implement "change color of all shapes of the same type":
        /*
        const newColor = Math.floor(Math.random() * 0xFFFFFF);
        this.model.shapes.forEach(s => {
            if (s.type === type) {
                s.color = newColor;
                this.pixiView.updateShapeColor(s.id, s);
            }
        });
        */
    }
}
