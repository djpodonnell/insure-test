class Decoder {
    email: string;
    provider:string;

    constructor (emailEntry:string, prov: string) {
         this.email = emailEntry;
         this.provider = prov;
    }
}

export default Decoder;