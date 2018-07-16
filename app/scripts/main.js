'use strict';

{
/*
 ** Step 1: Fetch all image paths from JSON source file on load
 */

  async function load() {
    // Declare counter... we use this later  
    let i = 0;

    // Await keyword will wait to load data variable
    let data = await fetch('./scripts/gsx.json').then(function (response) {
      if (response.ok) {
        response.json().then(function (json) {
          data = json;
          
          console.log(data);
          // If .json file exists, call createSub()
          createSubset();
        });
      } else {
        // Alert if network fails
        console.log(`NETWORK REQUEST FAILURE - ${response.status} : ${response.statusText}`);
      }
    }).bind;



    /*
     ** Step 2: Create Subset Array of 4 images from larger array of all images
     */

    function createSubset(counter) {
      // We use this so we only load 4 images at a time
      const chunk = 4;
      
      // Create arrays based on JSON data - Used arrays housed in columns objects to 
      // make it trickier, could have loaded single objects in the rows section 
      let imageItemArray = data.columns.image;
      let descriptionItemArray = data.columns.description;
      let tagItemArray = data.columns.tag;
      let dateItemArray = data.columns.date;
        console.log(dateItemArray);

      // Create subset arrays
      let subsetImg, subsetDes, subsetTag, subsetDate;

      // Iterate if array is less than 18
      if (i <= 18) {
      
        // We use imageItemArray.length since it's the same as the other arrays 
        // then we increment 4 at a time   
        for (i; i < imageItemArray.length; i += chunk) {

         // We use slice to create new array objects based on 
         // 4 items at a time
          subsetImg = imageItemArray.slice(i, i + chunk);
          subsetDes = descriptionItemArray.slice(i, i + chunk);
          subsetTag = tagItemArray.slice(i, i + chunk);
          subsetDate = dateItemArray.slice(i, i + chunk);

          // We pass the new arrays into the iterateAcrossSub function 
          iterateAcrossSub(subsetImg, subsetDes, subsetTag, subsetDate);

          // We increase the counter by chunk
          i += chunk;

          // We stop the function from running until event
          break;
        }
      }
    }
    /*
     ** Step 3: Iterate across Subset Array
     */
    function iterateAcrossSub(subsetImgArray, subsetDesArray, subsetTagArray, subsetDateArray) {
      // We loop through the subsets and push the subset items into
      // populateDom function
      for (let j = 0; j < subsetImgArray.length; j++) {
        populateDom(subsetImgArray[j], subsetDesArray[j], subsetTagArray[j], subsetDateArray[j]);
      }
    }

    /*
     ** Step 4: Push each subset image item to the DOM
     */

    function populateDom(subsetImgItem, subsetDesItem, subsetTagItem, subsetDateItem) {
      const main = document.querySelector('main');
        console.log(subsetDateItem)
      // create DOM elements
      const section = document.createElement('section');
      const heading = document.createElement('h2');
      const para = document.createElement('p');
      const image = document.createElement('img');
      const sup = document.createElement('sup');

      // Set their values equal to the array item values
      heading.innerHTML = subsetDesItem;
      para.innerHTML = subsetTagItem;
      sup.innerHTML = subsetDateItem;

      image.src = subsetImgItem;
      image.alt = subsetDesItem;
      image.title = subsetDesItem;
 
      // Append it to the DOM
      section.appendChild(sup);
      section.appendChild(image);
      section.appendChild(heading);
      section.appendChild(para);

      main.appendChild(section);
    }

    /*
     ** Step 5: Listen for scroll event and load more images
     */
    window.addEventListener('scroll', function (e) {
      // Get the position of the last image and offset it
      let lastImg = main.lastElementChild.offsetTop - 900;

      // Get position of user
      let userPosition = window.scrollY;

      // If user reaches the last element load the next 4 images
      if (userPosition > lastImg) {
        
        // Set timeout so that it's not janky
        setTimeout(() => {
          createSubset();
        }, 500);
      }

    });
  }

  // Init load() function within ES6 IIFE
  load();
}
