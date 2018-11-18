import { nSQL } from 'nano-sql';

export abstract class SolveRepo{
  public static TABLE = {
    CATEGORIES: 'categories',
    PUZZLES: 'puzzles',
    SOLVES: 'solves'
  };

  public static init(){
    nSQL('puzzles')
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'name',type:'string'},
        {key:'categories',type:'int[]'}
      ]);
    nSQL('categories')
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'puzzleId',type:'int'},
        {key:'name',type:'string'},
        {key:'scrambler', type:'string'}
      ]);
    nSQL('solves')
      .model([
        {key:'id',type:'int',props:['pk','ai']},
        {key:'categoryId',type:'int'},
        {key:'sessionId', type:'int'},
        {key:'timestamp',type:'int'},
        {key:'penalty',type:'int'},
        {key:'time',type:'int'},
        {key:'scramble',type:'string'}
      ]);

    nSQL()
      .config({id: 'default', mode: 'PERM'})
      .connect();
  }

  public static onConnected(){
    return new Promise((resolve, reject) => {
      nSQL().onConnected(()=> {
        resolve();
      })
    });
  }
}