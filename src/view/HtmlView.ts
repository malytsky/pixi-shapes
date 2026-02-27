export class HtmlView {
    private numShapesField: HTMLElement;
    private surfaceAreaField: HTMLElement;
    private shapesPerSecValue: HTMLElement;
    private gravityValue: HTMLElement;

    constructor() {
        this.numShapesField = document.getElementById('num-shapes')!;
        this.surfaceAreaField = document.getElementById('surface-area')!;
        this.shapesPerSecValue = document.getElementById('shapes-per-sec-val')!;
        this.gravityValue = document.getElementById('gravity-val')!;
    }

    public updateStats(numShapes: number, area: number) {
        this.numShapesField.innerText = numShapes.toString();
        this.surfaceAreaField.innerText = Math.round(area).toString();
    }

    public updateControls(shapesPerSec: number, gravity: number) {
        this.shapesPerSecValue.innerText = shapesPerSec.toString();
        this.gravityValue.innerText = gravity.toString();
    }

    public onShapesPerSecChange(callback: (delta: number) => void) {
        document.getElementById('shapes-per-sec-minus')!.onclick = () => callback(-1);
        document.getElementById('shapes-per-sec-plus')!.onclick = () => callback(1);
    }

    public onGravityChange(callback: (delta: number) => void) {
        document.getElementById('gravity-minus')!.onclick = () => callback(-1);
        document.getElementById('gravity-plus')!.onclick = () => callback(1);
    }
}
