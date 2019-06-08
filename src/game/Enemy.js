export default class Enemy {

    constructor(level) {
        this.level = level;
        this.scene = level.scene;
        this.mesh = null;

        this.maxDistanceFromCenter = level.enemyDistanceFromCenter;
        this.defaultAltitude = 2.5;
        this.speed = 0.4;        

        this.attackSound = this.level.assets.getSound('monsterAttack');

        this.states = {
            'DESTROYED': false,
            'FOLLOWING': false,
            'ATTACKING': false,
            'CLOSE_TO_PLAYER': false,
        };
    }

    create() {
        
        this.mesh = this.level.assets.getMesh('enemy').clone();
        this.mesh.enemyObject = this;
        this.mesh.checkCollisions = true;
        
        BABYLON.Tags.AddTagsTo(this.mesh, 'enemy');

        this.mesh.position.x = Math.floor((Math.random() * 100)) - 50;
        this.mesh.position.z = Math.floor((Math.random() * 100)) - 50;
        this.mesh.position.y = this.defaultAltitude;

        this.mesh.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
        
        this.generateRandomPosition();

        return this;
    }

    move() {
        if(!this.mesh) return;
        if(this.states.DESTROYED) return;

        let distanceFromPlayer = this.level.camera.position.subtract(this.mesh.position).length();

        if(distanceFromPlayer <= 5) {
            this.attack(distanceFromPlayer);
        } else if(distanceFromPlayer <= 27) {
            this.followPlayer();
        } else {
            this.gotToRandomDirection();
        }
    }

    followPlayer() {
        this.states.ATTACKING = false;
        this.states.FOLLOWING = true;

        GAME.helper.moveObjectTo(this.mesh, this.level.camera.position, this.speed);
    }

    attack(distanceFromPlayer) {
        this.states.FOLLOWING = false;

        if(!this.states.ATTACKING) {
            this.attackSound.play();
            this.states.ATTACKING = true;
        }

        if(distanceFromPlayer > 3) {
            GAME.helper.moveObjectTo(this.mesh, this.level.camera.position, this.speed * 2);
        }

        this.checkAttackedThePlayer(distanceFromPlayer);
    }

    /**
     * Let's use a simple logic to check if the user was damaged by the enemy
     * considering the distance from player and the enemy attack mode
     * @param {*} distanceFromPlayer 
     */
    checkAttackedThePlayer(distanceFromPlayer) {
        if(!this.states.ATTACKING) return;

        if(distanceFromPlayer <= 3.5) {
            
            if(!this.states.CLOSE_TO_PLAYER) {
                this.level.playerWasAttacked();
            }
            
            this.states.CLOSE_TO_PLAYER = true;
        } else {
            this.states.CLOSE_TO_PLAYER = false;
        }
    }

    gotToRandomDirection() {
        GAME.helper.moveObjectTo(this.mesh, this.randPosition, this.speed);        
        
        // If is close to the destination, generates a new position
        if(this.randPosition.subtract(this.mesh.position).length() <= 1) {
            this.generateRandomPosition();
        }
    }

    generateRandomPosition() {
        let randomPositionX = Math.floor((Math.random() * this.maxDistanceFromCenter)) - (this.maxDistanceFromCenter / 2);
        let randomPositionZ = Math.floor((Math.random() * this.maxDistanceFromCenter)) - (this.maxDistanceFromCenter / 2);
        // let altitude = Math.floor(Math.random() * 7);

        this.randPosition = new BABYLON.Vector3(randomPositionX, this.defaultAltitude, randomPositionZ);
    }

    destroy() {
        this.level.playerHitEnemy();

        this.states.DESTROYED = true;
        // this.dieSound.play();
        this.level.interpolate(this.mesh.position, 'y', 0.5, 100 * this.mesh.position.y);
        
        this.remove();
    }

    remove() {
        if(!this.mesh) return;
        
        setTimeout(() => {
            this.mesh.dispose();
            this.mesh = null;
        }, 300);
    }

}