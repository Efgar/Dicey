export class DiceLog {
    roomId: String;
    characterName: String;
    userImageUrl: String;
    colorRGB: String;
    rollName: String;
    date: Date;
    rendered = false;
    dice: {
        maxValue: number;
        result: number;
    }[] = [];
    modifiers: {
        name: string;
        value: number;
    }[] = [];
    total: number;
}
