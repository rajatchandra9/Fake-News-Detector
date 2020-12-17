import React,{Component} from "react";
class ImageLinkForm extends Component{
    constructor(props){
        super(props);
        this.state={
            searchfake:"",
            isfake:"",
            output:""
        }
    }
    handleChange=(evt)=>{
        this.setState({searchfake:evt.target.value});
    }
    handleSubmit=(evt)=>{
        evt.preventDefault();
        fetch("/signin/id/:id",{
            method:"post",
            headers: {"Content-Type":'application/json'},
            body: JSON.stringify({
                news:this.state.searchfake
            })
        })
         .then(response=>response.json())
         .then(result=>{
             console.log(result);
             this.setState({isfake:result.fakeis,output:result.msg});
             
         })
    }
    render(){
        return(
            <div>
                <p style={{color:"white"}}>This brain will tell you if the news below is real or not</p>
                { this.state.isfake!=="" && <h1>{this.state.output}</h1>}
                <form onSubmit={this.handleSubmit}>
                <input type="text" width="70%" placeholder="Check if the news is fake or real.." onChange={this.handleChange} value={this.state.searchfake}/>
                <br></br>
                <button style={{marginLeft:"100px"}} type="submit">Detect</button>
                </form>
            </div>
        );
    }
}

export default ImageLinkForm;