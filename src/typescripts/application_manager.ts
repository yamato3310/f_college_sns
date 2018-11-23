import { ProductType } from './entities';

interface VoteIdsType { 'fashion': number[]; 'beauty': number[]; }

export class ApplicationManager {

    public static get instance(): ApplicationManager {

        if (this.DEBUG || !this._instance) {
            const voteIds = this.getVoteIds();
            const uuid = this.getUuid() || '';
            const remainedVoteCount = this.getRemainedVoteCount();
            this._instance = new ApplicationManager(voteIds, uuid, remainedVoteCount);
        }

        return this._instance;
    }

    public static BEAUTY_VOTE_COUNT = 3;
    public static FASHION_VOTE_COUNT = 3;
    // TODO
    public static DEBUG = true;

    // Storage keyを定数に
    private static KEY_VOTE_IDS = 'DEBUG_voteIds';
    private static KEY_UUID = 'DEBUG_uuid';
    private static KEY_REMAINED_VOTE_COUNT = 'DEBUG_remainedVoteCount';

    // tslint:disable-next-line:variable-name
    private static _instance: ApplicationManager;

    private static getVoteIds = () => {
        const voteIds = localStorage.getItem(ApplicationManager.KEY_VOTE_IDS) || '"{}"';

        if (ApplicationManager.DEBUG && !voteIds) {
            const initialVoteIds = { fashion: [], beauty: [] };
            localStorage.setItem(ApplicationManager.KEY_VOTE_IDS, JSON.stringify(initialVoteIds));
            return initialVoteIds;
        }

        return JSON.parse(voteIds);
    }

    private static getUuid = () => {
        const uuid = localStorage.getItem(ApplicationManager.KEY_UUID);

        if (ApplicationManager.DEBUG && !uuid) return '';

        return uuid;
    }

    private static getRemainedVoteCount = () => {
        let remainedVoteCount: any = localStorage.getItem(ApplicationManager.KEY_REMAINED_VOTE_COUNT);

        if (ApplicationManager.DEBUG && !remainedVoteCount) {
            remainedVoteCount = {};
            remainedVoteCount.fashion = ApplicationManager.FASHION_VOTE_COUNT;
            remainedVoteCount.beauty = ApplicationManager.BEAUTY_VOTE_COUNT;
            localStorage.setItem(ApplicationManager.KEY_REMAINED_VOTE_COUNT, JSON.stringify(remainedVoteCount));
            return remainedVoteCount;
        }

        return JSON.parse(remainedVoteCount);
    }

    public voteIds: VoteIdsType;
    public uuid: string;
    public remainedVoteCount: { fashion: number, beauty: number };

    private constructor(voteIds: VoteIdsType, uuid: string, remainedVoteCount: { fashion: number, beauty: number }) {
        this.voteIds = voteIds;
        this.uuid = uuid;
        this.remainedVoteCount = remainedVoteCount;
    }

    public setUuid = (uuid: string) => {
        this.uuid = uuid;
        localStorage.setItem(ApplicationManager.KEY_UUID, uuid);
    }

    public pushVoteIds = (id: number, key: ProductType) => {
        const tmpStorageIds = localStorage.getItem(ApplicationManager.KEY_VOTE_IDS) || '"{}"';
        const parsedTmpStorageIds = JSON.parse(tmpStorageIds);

        if (parsedTmpStorageIds[key.toLowerCase()].includes(id)) return;

        parsedTmpStorageIds[key.toLowerCase()].push(id);
        this.voteIds = parsedTmpStorageIds;
        localStorage.setItem(ApplicationManager.KEY_VOTE_IDS, JSON.stringify(this.voteIds));
        this.decrementRemainedVoteCount(key);
    }

    public popVoteIds = (id: number, key: ProductType) => {
        const tmpStorageIds = localStorage.getItem(ApplicationManager.KEY_VOTE_IDS) || '"{}"';
        const parsedTmpStorageIds = JSON.parse(tmpStorageIds);
        parsedTmpStorageIds[key.toLowerCase()] = parsedTmpStorageIds[key.toLowerCase()].filter((e: number) => e !== id);
        this.voteIds = parsedTmpStorageIds;
        localStorage.setItem(ApplicationManager.KEY_VOTE_IDS, JSON.stringify(this.voteIds));
        this.incrementRemainedVoteCount(key);
    }

    public incrementRemainedVoteCount = (key: ProductType) => {
        const tmpRemainedVoteCount = localStorage.getItem(ApplicationManager.KEY_REMAINED_VOTE_COUNT);
        if (!tmpRemainedVoteCount) return;

        const parsedStorageVoteCount = JSON.parse(tmpRemainedVoteCount);
        const keyName = ['BEAUTY_VOTE_COUNT', 'FASHION_VOTE_COUNT'].find(n => n.includes(key.toUpperCase()));

        // FIXME ↓みたいにしたいけどコンパイラに怒られた if ( keyName && parsedStorageVoteCount[key] >=
        // ApplicationManager[keyName]) return;
        if (keyName === 'BEAUTY_VOTE_COUNT') {
            if (parsedStorageVoteCount[key.toLowerCase()] >= ApplicationManager.BEAUTY_VOTE_COUNT) return;
        } else {
            if (parsedStorageVoteCount[key.toLowerCase()] >= ApplicationManager.FASHION_VOTE_COUNT) return;
        }

        parsedStorageVoteCount[key.toLowerCase()] += 1;
        this.remainedVoteCount = parsedStorageVoteCount;
        localStorage.setItem(ApplicationManager.KEY_REMAINED_VOTE_COUNT, JSON.stringify(this.remainedVoteCount));
    }

    public decrementRemainedVoteCount = (key: ProductType) => {
        const tmpRemainedVoteCount = localStorage.getItem(ApplicationManager.KEY_REMAINED_VOTE_COUNT);
        if (!tmpRemainedVoteCount) return;

        const parsedStorageVoteCount = JSON.parse(tmpRemainedVoteCount);

        if (parsedStorageVoteCount[key.toLowerCase()] <= 0) return;

        parsedStorageVoteCount[key.toLowerCase()] -= 1;
        this.remainedVoteCount = parsedStorageVoteCount;
        localStorage.setItem(ApplicationManager.KEY_REMAINED_VOTE_COUNT, JSON.stringify(this.remainedVoteCount));
    }
}
