import React from 'react';
import './SearchResult.css';
import { Rating } from 'semantic-ui-react'

const SearchResult = (props) => {
    return(
        <div className=''>
            <div className='searchResultContainer'>
                <div className="searchResultImagePrice">
                    <img className="searchResultImage" src={props.image}/>
                    <div className='searchResultPriceScreen'>
                        <div className='searchResultPrice'>{ `$${props.price}`}</div>
                    </div>
                </div>
            </div>
            <div className='searchResultName'>
                <span>{props.name}</span>   
            </div>
            <div>
                <span> 
                    <Rating defaultRating={props.rating} maxRating={5} disabled />
                    {props.reviewCount && `${props.reviewCount} Reviews`}
                </span>
            </div>
        </div>
    );
}

export default SearchResult;