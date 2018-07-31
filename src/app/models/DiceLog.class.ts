export class DiceLog {
    roomId: String;
    characterName: String;
    userImageUrl: String = 'https://www.w3schools.com/howto/img_avatar.png';
    colorRGB: String = 'red';
    rollName: String = 'Testing';
    date: Date;
    dice: {
        type: String;
        result: number;
    }[] = [];
    modifier: number;
    total: number;

    public getsomething() {
        return 'OMG';
    }
}
