export abstract class SolveRepo{
  public static TABLE = {
    CATEGORIES: 'categories',
    PUZZLES: 'puzzles',
    SOLVES: 'solves'
  };

  public static async nSQL(setTablePointer?: string | any[] | undefined) {
    const nsql = await import('nano-sql');
    return nsql.nSQL(setTablePointer);
  }

  public static async init(){
    (await SolveRepo.nSQL('puzzles'))
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'name',type:'string'},
        {key:'categories',type:'int[]'}
      ]);
    (await SolveRepo.nSQL('categories'))
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'puzzleId',type:'int'},
        {key:'name',type:'string'},
        {key:'scrambler', type:'string'}
      ]);
    (await SolveRepo.nSQL('solves'))
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'categoryId',type:'int'},
        {key:'sessionId', type:'int'},
        {key:'timestamp',type:'int'},
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