export default class Player {

    constructor(level) {
        
        this.level = level;
        this.scene = level.scene;

        this.hits = 0;

        this.points = 0;
        this.pointsRecord = false;

        this.initialTime = null;
        this.endTime = null;
        this.elapsedTime = 0;

    }

    startTimeCounter() {
        this.initialTime = new Date();
        this.elapsedTime = 0;
    }

    stopTimeCounter() {
        this.endTime = new Date();
        this.elapsedTime = (this.endTime - this.initialTime) / 1000;
    }

    getPoints() {
        return this.points;
    }

    calculatePoints() {
        let elapsedTime = this.elapsedTime || 1;
        
        this.points = (this.hits * 100);
        
        this.points = (elapsedTime < this.points) ? this.points - elapsedTime : this.points;
        this.points = this.points - this.level.weapon.shots;
        
        this.points = parseInt(this.points, 10);

        this.points = (this.points > 0) ? this.points : this.hits;

        this.checkAndSaveRecord(this.points);

        return this.points;
    }

    checkAndSaveRecord(points) {
        let lastRecord = 0;

        this.pointsRecord = false;

        if(window.localStorage['last_record']) {
            lastRecord = parseInt(window.localStorage['last_record'], 10);
        }

        if(lastRecord < points) {
            this.pointsRecord =  true;
            window.localStorage['last_record'] = points;
        }
    }

    hasMadePointsRecord() {
        return this.pointsRecord;
    }

    getLastRecord() {
        return window.localStorage['last_record'] || 0;
    }

}