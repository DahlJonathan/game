export default class Game {
    constructor() {
        this.player = document.getElementById("player");
        this.step = 10;

        // Ensure player has a position set
        this.player.style.position = "absolute";
        this.player.style.left = this.player.style.left || "0px";
        this.player.style.top = this.player.style.top || "0px";

        // Bind event listener
        document.addEventListener("keydown", this.handleMovement.bind(this));
    }

    handleMovement(event) {
        let left = parseInt(this.player.style.left);
        let top = parseInt(this.player.style.top);

        if (event.key === "ArrowRight") left += this.step;
        if (event.key === "ArrowLeft") left -= this.step;
        if (event.key === "ArrowDown") top += this.step;
        if (event.key === "ArrowUp") top -= this.step;

        this.player.style.left = left + "px";
        this.player.style.top = top + "px";
    }
}
