
const checker= (input)=>
{   let result=
    {
        result:true,
        errors:[]
    }
   Object.keys(input).forEach(element => {
        if(input[element]===''||input===null)
       { result.errors.push(element)
         result.result=false
       }
    });
    return {...result}
}
module.exports=checker