import React from "react";
import './style.css';
import Story from "./story";

const Stories = () => {
const stories =[
    { name:"kholoud",
       user_photo :"\pexels-kristinanor-3294254.jpg",
       story_photo:"https://images.pexels.com/photos/11122354/pexels-photo-11122354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    { name:"kholoud",
        user_photo :"\pexels-kristinanor-3294254.jpg",
        story_photo:"https://images.pexels.com/photos/18893530/pexels-photo-18893530/free-photo-of-ville-gratte-ciel-gratte-ciels-urbain.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
     },
     { name:"kholoud",
        user_photo :"\pexels-kristinanor-3294254.jpg",
        story_photo:"https://images.pexels.com/photos/9024407/pexels-photo-9024407.jpeg?auto=compress&cs=tinysrgb&w=400"
     },
];

    return (
        <>
            <div className="stories">
             <Story type = "new"/>  
            {stories.map(story => <Story type = "old" data={story}/> )} 
              
            </div>
        </>
    );
}

export default Stories;
