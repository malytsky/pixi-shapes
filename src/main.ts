import { GameModel } from './model/GameModel';
import { PixiView } from './view/PixiView';
import { HtmlView } from './view/HtmlView';
import { GameController } from './controller/GameController';

async function bootstrap() {
    const model = new GameModel();
    const pixiView = new PixiView();
    const htmlView = new HtmlView();
    
    const controller = new GameController(model, pixiView, htmlView);
    await controller.init();
}

bootstrap().catch(console.error);
