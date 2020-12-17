import React, { useEffect } from 'react';
import './NewsApiConnector.css';

async function searchNews(q) {
  q = encodeURIComponent(q);
  // const response = await fetch(`https://bing-news-search1.p.rapidapi.com/news/search?freshness=Day&textFormat=Raw&safeSearch=Strict&q=${q}`, {
  //   "method": "GET",
  //   "headers": {
  //     "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
  //     "x-rapidapi-key": "e02a339961msh4ded6b34f200eb6p15d0a8jsnc827f0e5075f",
  //     "x-bingapis-sdk": "true"
  //   }
  // });
  fetch(`/newsfeed/${q}`)
      .then(result => result.json())
      .then(body => {return body});
  // const body = await response.json();
  // console.log("Body",body);
  // return body.value;
}
function NewsApiConnector() {
  const [query, setQuery] = React.useState("Search Your News Here !");
  // console.log(searchNews(query).then(console.log));
  const [list, setList] = React.useState(null);
  useEffect(()=>{
    const listener=e=>{
      e.preventDefault()
    }
    {list===null &&
      fetch(`/newsfeed/${encodeURIComponent(query)}`)
      .then(result => result.json())
      .then(body => setList(body.value))};
  });
  return (
    <div className="app">
      {/* <form onSubmit={search} style={{width:"50rem",border:"none"}}>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{width:"70%"}}
        />
        <button style={{width:"200px",marginLeft:"-200px",height:"55px",margin:"0",paddingRight:"2px",borderRadius:"10px"}}>Search</button>
      </form> */}
      {!list
        ? null
        : list.length === 0
          ? <p><i>No results</i></p>
          : <ul>
            {list.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </ul>
      }
    </div>
  );
}
function Item({ item }) {
  const separateWords = s => s.replace(/[A-Z][a-z]+/g, '$& ').trim();
  const formatDate = s => new Date(s).toLocaleDateString(undefined, { dateStyle: 'long' });
  return (
    <li className="item">
      {item.image &&
        <img className="thumbnail"
          alt=""
          src={item.image?.thumbnail?.contentUrl}
        />
      }
      <h2 className="title">
        <a href={item.url}>{item.name}</a>
      </h2>
      <p className="description">
        {item.description}
      </p>
      <div className="meta">
        <span>{formatDate(item.datePublished)}</span>
        <span className="provider">
          {item.provider[0].image?.thumbnail &&
            <img className="provider-thumbnail"
              alt=""
              src={item.provider[0].image.thumbnail.contentUrl + '&w=16&h=16'}
            />
          }
          {item.provider[0].name}
        </span>
        {item.category &&
          <span>{separateWords(item.category)}</span>
        }
      </div>
    </li>
  );
}
export default NewsApiConnector;