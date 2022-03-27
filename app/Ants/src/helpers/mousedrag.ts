export class MouseDragHandler {
    isMouseDown = false;
    startX: number = 0;
    startY: number = 0;

    register<TElement extends HTMLElement>(component: TElement, callback: (ev: MouseMovement) => void) {
        component.addEventListener("mousedown", this.onMouseDown.bind(this));
        component.addEventListener("mouseup", this.onMouseUp.bind(this));
        component.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        component.addEventListener("mousemove", this.onMouseMove(callback).bind(this));
    }

    private onMouseDown(ev: MouseEvent) {
        ev.preventDefault();
        this.isMouseDown = true;
        this.startX = ev.clientX;
        this.startY = ev.clientY;
    }

    private onMouseUp(ev: MouseEvent) {
        this.isMouseDown = false;
    }

    private onMouseLeave(ev: MouseEvent) {
        this.isMouseDown = false;
    }

    private onMouseMove(callback: (ev: MouseMovement) => void): (ev: MouseEvent) => void {
        var handler = (ev: MouseEvent) => {
            if (this.isMouseDown) {
                callback({
                    x: ev.clientX,
                    y: ev.clientY,
                    displacementX: ev.clientX - this.startX,
                    displacementY: ev.clientY - this.startY,
                    movementX: ev.movementX,
                    movementY: ev.movementY
                });
            }
        }
        return handler.bind(this);
    }
}

export interface MouseMovement {
    x: number;
    y: number;
    movementX: number;
    movementY: number;
    displacementX: number;
    displacementY: number;
}