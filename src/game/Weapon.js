export default class Weapon {
    
    constructor(level) {

        this.level = level;
        this.scene = level.scene;

        this.fireRate = 350; // Milliseconds between each fire
        this.canFire = true;
        this.currentFireRate = 0;

        this.fireSound = this.level.assets.getSound('shotgun');
    }

    create() {
        this.mesh = this.level.assets.getMesh('shotgun').clone();
        this.mesh.isVisible = true;

        this.mesh.rotationQuaternion = null;
        this.mesh.rotation.y = -Math.PI/2;
        
        this.mesh.parent = this.level.camera;
        this.mesh.position = new BABYLON.Vector3(0.4,-0.45,1.1);
        this.mesh.scaling = new BABYLON.Vector3(2, 2, 2);

        this.controlFireRate();
    }

    fire() {
        var width = this.scene.getEngine().getRenderWidth();
        var height = this.scene.getEngine().getRenderHeight();
        
        // Is the player control enabled?
        if (this.level.controlEnabled) {
            var pickInfo = this.scene.pick(width/2, height/2, null, false, this.camera);
            this.doFire(pickInfo);
        }
    }

    doFire(pickInfo) {
        if (this.canFire) {

            this.fireSound.play();
            
            // If we hit an enemy
            if (pickInfo.hit && BABYLON.Tags.HasTags(pickInfo.pickedMesh) 
            && pickInfo.pickedMesh.matchesTagsQuery('enemy')) {
                let mainMesh = (pickInfo.pickedMesh.parent) ? pickInfo.pickedMesh.parent : pickInfo.pickedMesh;
                mainMesh.enemyObject.destroy();
            } else {
                if(pickInfo.pickedPoint) {
                    let box = BABYLON.Mesh.CreateBox('box', 0.1, this.scene);
                    box.position = pickInfo.pickedPoint.clone();
                }
            }
            
            this.animateFire();

            this.canFire = false;
        }
    }

    animateFire() {
        this.level.interpolate(this.mesh.position, 'z', 0.9, 50);
            
        setTimeout(() => {
            this.level.interpolate(this.mesh.position, 'z', 1.1, 50);
        }, 100);
    }

    controlFireRate() {
        if (!this.canFire) {
            this.currentFireRate -= GAME.engine.getDeltaTime();
            
            if (this.currentFireRate <= 0) {
                this.canFire = true;
                this.currentFireRate = this.fireRate;
            }
        }
    }

}