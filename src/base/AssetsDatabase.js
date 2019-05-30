export default class AssetsDatabase {
    
    constructor(scene, finishCallback) {

        this.scene = scene;

        this.meshes = [];
        this.sounds = [];
        this.animatedMeshes = [];

        this.manager = new BABYLON.AssetsManager(this.scene);

        this.manager.onFinish = (tasks) => {
            if(finishCallback) finishCallback(tasks);
        };

    }

    /**
     * Adds a sound to be loaded
     * @param {*} name 
     * @param {*} file 
     * @param {*} options 
     */
    addSound(name, file, options) {
        let fileTask = this.manager.addBinaryFileTask(name + '__SoundTask', file);

        fileTask.onSuccess = (task) => {
            this.sounds[name] = new BABYLON.Sound(name, task.data, this.scene, null, options);
            
            // Execute a success callback
            if(options.onSuccess) {
                options.onSuccess(this.sounds[name]);
            }
        }

        return this.sounds[name];
    }

    /**
     * Adds a music (sound with some predefined parametes that can be overwriten)
     * By default, musics are automatically played in loop
     * @param {*} name 
     * @param {*} file 
     * @param {*} options 
     */
    addMusic(name, file, options = {}) {

        options.loop = (typeof options.loop !== 'undefined') ? options.loop : true;
        options.volume = (typeof options.volume !== 'undefined') ? options.volume : 0.5;
        options.autoplay = (typeof options.autoplay !== 'undefined') ? options.autoplay : true;

        return this.addSound(name, file, options);

    }

    addMergedMesh(name, file, options) {
        return this.addMesh(name, file, options, true);
    }

    addMesh(name, file, options = {}, mergeMeshes = false) {
        let fileTask = this.manager.addMeshTask(name + '__MeshTask', '', file);

        fileTask.onSuccess = (task) => {
            
            let mesh = null;
            
            try {
                if(mergeMeshes) {
                    mesh = BABYLON.Mesh.MergeMeshes(task.loadedMeshes);   
                } else {
                    mesh = task.loadedMeshes[0];
                }

                mesh.setEnabled(false);
    
                this.meshes[name] = mesh;
                
                // Execute a success callback
                if(options.onSuccess) {
                    options.onSuccess(this.meshes[name]);
                }
            } catch (error) {
                console.error(error)
            }

        }

        return this.meshes[name];
    }

    addAnimatedMesh(name, file, options = {}) {
        let fileTask = this.manager.addMeshTask(name + '__AnimatedMeshTask', '', file);

        fileTask.onSuccess = (task) => {
            try {
                let mesh = task.loadedMeshes[0];
                mesh.setEnabled(false);
    
                this.animatedMeshes[name] = this.buildAnimatedMeshData(mesh, task, options);
                
                // Execute a success callback
                if(options.onSuccess) {
                    options.onSuccess(this.animatedMeshes[name]);
                }
            } catch (error) {
                console.error(error)
            }

        }

        return this.animatedMeshes[name];
    }

    buildAnimatedMeshData(mesh, task, options) {
        let start = 0,
            end = 0;

        if(options.start || options.startFrame) {
            start = options.startFrame ? options.startFrame / 30 : options.start;
            end = options.endFrame ? options.endFrame / 30 : options.end;
        }

        mesh.animationGroups = task.loadedAnimationGroups;

        mesh.animationGroups.forEach(function (animationGroup) {
            if(options.normalized) {
                animationGroup.normalize(start, end);
            }

            animationGroup.pause();
        });

        return mesh;

    }

    playMeshAnimation(meshName, start, end, loop = false) {
        let mesh = this.getAnimatedMesh(meshName);

        start = start / 30;
        end = end / 30;

        mesh.animationGroups.forEach(function (animationGroup) {
            animationGroup.stop();
            animationGroup.start(false, 1, start, end);
        });
    }

    getMesh(name) {
        if(!this.meshes[name]) {
            GAME.log.debugError('There is no mesh called "' + name + '"');
            return;
        }

        return this.meshes[name];     
    }

    getAnimatedMesh(name) {
        if(!this.animatedMeshes[name]) {
            GAME.log.debugError('There is no animated mesh called "' + name + '"');
            return;
        }

        return this.animatedMeshes[name];     
    }

    getSound(name) {
        return this.sounds[name];
    }

    load() {
        this.manager.load();
    }

}