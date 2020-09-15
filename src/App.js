import React, { Component } from "react";

import "./App.css";


const formatNumber = (number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);
class App extends Component {
state = {

  combinedUniqueData: [],
  total:0,
  allComData:[],
  sort:false,
  search:""

}

 async componentDidMount(){
const promise1 = new Promise((resolve, reject) =>  


    fetch(`${process.env.PUBLIC_URL}/api/branch1.json`)
.then((r) => r.json())
.then((d) =>{

    resolve(d.products)
    }
)


)


const promise2 = new Promise((resolve, reject) =>  


    fetch(`${process.env.PUBLIC_URL}/api/branch2.json`)
.then((r2) => r2.json())
.then((d2) =>{

    resolve(d2.products)
    }
)

)



const promise3 = new Promise((resolve, reject) =>  


    fetch(`${process.env.PUBLIC_URL}/api/branch3.json`)
.then((r3) => r3.json())
.then((d3) =>{

    resolve(d3.products)
    }
)

)


Promise.all([promise1,promise2,promise3]).then( (dataValue)=>{
let combinedData = [ ...dataValue[0] , ...dataValue[1], ...dataValue[2]   ]

  const newCombinedData = [];
const len = combinedData.length;
for(let i=0; i < len; i++){
	if(newCombinedData[combinedData[i].id] === undefined) {

  
    newCombinedData[combinedData[i].id] = combinedData[i];
    }
    else {

     
      newCombinedData[combinedData[i].id].sold = newCombinedData[combinedData[i].id].sold + combinedData[i].sold;

      }
}
const arrFinal = [];
let sum=0;

for(let key in newCombinedData ){
arrFinal.push(newCombinedData[key]);
sum  += newCombinedData[key].unitPrice  * newCombinedData[key].sold ;


}
this.setState({combinedUniqueData:arrFinal, allComData:arrFinal, total:sum  })



})

  }





  onChangeHandler=(event)=> {
    let value = event.target.value;
   
    this.setState({search: value});

    let dataVal = this.state.allComData;
    let dataSearch=[];

    dataSearch = dataVal.filter((dValue)=>{
        return dValue.name.toLowerCase().search(value.toLowerCase()) !== -1;});
  console.log("data",dataSearch);

  let sum=0;
  for(let key of dataSearch){
    sum  += key.unitPrice  * key.sold ;
  
  }

this.setState({  combinedUniqueData:dataSearch, total:formatNumber(sum)});



   
}





  render() {

let allData = [...this.state.combinedUniqueData];

if(this.state.sort){
  allData.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 
}
else{
  allData = this.state.combinedUniqueData;
}




    return (
      <div className="product-list">

        <input placeholder="Search Products" onChange= {(e)=>this.onChangeHandler(e)} value={this.state.search}  type="text" />
        
        <table>
        <thead>
          <tr>
            <th onClick={()=>this.setState({sort:!this.state.sort})} >Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
     

     {
       allData.map((val,i)=>{
        return(
         <tr key = {val.id}>
          <td> {val.name} </td>
        <td>{formatNumber(val.sold * val.unitPrice)  }</td>
         </tr>

        )})
     }


        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
    <td>{this.state.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
  }
}

export default App;
