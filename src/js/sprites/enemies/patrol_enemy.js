import { Enemy } from './sprites/enemy';

export class PatrolEnemy extends Enemy {
    constructor(game, x, y, data) {
        data.speed = data.speed || -200;
        data.maxDistance = data.maxDistance || 150;
        data.attackDamage = data.attackDamage || 1;
        data.health = data.health || 2;
        super(game, x, y, data);
        this.body.velocity.x = data.speed;
        this.maxDistance = data.maxDistance;
        this.startPositionX = this.position.x;
    }

    update() {
        super.update();
        if (Math.abs(this.position.x - this.startPositionX) >= this.maxDistance) {
            this.startPositionX = this.position.x;
            this.body.velocity.x *= -1;
        }
    }
}
