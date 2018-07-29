export class DiceLog {
    roomId: String;
    characterName: String;
    userImageUrl: String;
    colorRGB: String;
    rollName: String;
    date: Date;
    dice: {
        type: String;
        result: number;
    }[] = [];
    modifier: number;
    total: number;
}
