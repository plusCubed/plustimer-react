import { NanoSQLInstance } from 'nano-sql';

export abstract class SolveRepo{
  public static TABLE = {
    CATEGORIES: 'categories',
    PUZZLES: 'puzzles',
    SOLVES: 'solves',
    SESSIONS: 'sessions'
  };

  public static async nSQL(setTablePointer?: string | any[] | undefined) {
    const nsql = await import('nano-sql');
    return nsql.nSQL(setTablePointer);
  }

  public static async init(){
    const nanoSQL = await SolveRepo.nSQL();

    nanoSQL.table(SolveRepo.TABLE.PUZZLES)
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'name',type:'string'},
        {key:'categories',type:'int[]'}
      ]);
    nanoSQL.table(SolveRepo.TABLE.CATEGORIES)
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'puzzleId',type:'int'},
        {key:'name',type:'string'},
        {key:'scrambler', type:'string'}
      ]);
    nanoSQL.table(SolveRepo.TABLE.SESSIONS)
      .model([
        {key:'id',type:'int',props:['pk']},
        {key:'categoryId',type:'int'},
        {key:'timestamp',type:'int', props:['idx']}
      ]);
    nanoSQL.table(SolveRepo.TABLE.SOLVES)
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'categoryId',type:'int'},
        {key:'sessionId', type:'int'},
        {key:'timestamp',type:'int', props:['idx']},
        {key:'penalty',type:'int'},
        {key:'time',type:'int'},
        {key:'scramble',type:'string'}
      ]);

    nanoSQL
      .config({id: 'default', mode: 'PERM'})
      .connect();
  }

  public static onConnected(){
    return SolveRepo.nSQL().then((nsql) => new Promise<NanoSQLInstance>((resolve, reject) => {
      nsql.onConnected(()=> {
        resolve(nsql);
      })
    }));
  }
}