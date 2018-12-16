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
    (await SolveRepo.nSQL(SolveRepo.TABLE.PUZZLES))
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'name',type:'string'},
        {key:'categories',type:'int[]'}
      ]);
    (await SolveRepo.nSQL(SolveRepo.TABLE.CATEGORIES))
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'puzzleId',type:'int'},
        {key:'name',type:'string'},
        {key:'scrambler', type:'string'}
      ]);
    (await SolveRepo.nSQL(SolveRepo.TABLE.SESSIONS))
      .model([
        {key:'id',type:'int',props:['pk']},
        {key:'categoryId',type:'int'},
        {key:'timestamp',type:'int', props:['idx']}
      ]);
    (await SolveRepo.nSQL(SolveRepo.TABLE.SOLVES))
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'categoryId',type:'int'},
        {key:'sessionId', type:'int'},
        {key:'timestamp',type:'int', props:['idx']},
        {key:'penalty',type:'int'},
        {key:'time',type:'int'},
        {key:'scramble',type:'string'}
      ]);

    (await SolveRepo.nSQL())
      .config({id: 'default', mode: 'PERM'})
      .connect();
  }

  public static onConnected(){
    return SolveRepo.nSQL().then((nsql) => new Promise((resolve, reject) => {
      nsql.onConnected(()=> {
        resolve();
      })
    }));
  }
}