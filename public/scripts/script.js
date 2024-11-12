document.addEventListener('DOMContentLoaded', function() {
  
    const phraseInput = document.getElementById('phrase-input');
    const searchButton = document.getElementById('search-button');
    const signsContainer = document.getElementById('signs-container');
    const tokenizedWordsContainer = document.getElementById('tokenized-words');  // Added to show tokenized words
    
    searchButton.addEventListener('click', async function() {
      const phrase = phraseInput.value.trim();
      
      if (phrase) {
        // Normalize the input
        const normalizedPhrase = normalizeInput(phrase);
        
        // Step 1: Tokenization (Recognizing words from the input phrase)
        const searchTerms = extractSearchTerms(normalizedPhrase);
        
        // Sanity Check 1: Display the tokenized words
        displayTokenizedWords(searchTerms);
        
        // Step 2: Fetch GIFs for each word
        await fetchAndDisplayGifs(searchTerms);
      } else {
        alert('Please enter a phrase.');
      }
    });
  
    // Normalize the input: Convert to lowercase and remove non-letter characters
    function normalizeInput(input) {
      return input
        .toLowerCase() 
        .replace(/[^a-z\s]/g, '') 
        .trim();  
    }
  
    // Extract individual search terms from the input (tokenization)
    function extractSearchTerms(input) {
      const words = input.split(/\s+/); 
      return words; 
    }
  
    // Sanity Check 1: Display the tokenized words
      function displayTokenizedWords(words) {
        tokenizedWordsContainer.innerHTML = '';  // Clear previous words
      
        // Join the words into a single string with commas
        const wordsText = words.join(', ');
      
        // Create a paragraph or div element to display the words
        const wordsParagraph = document.createElement('p');
        wordsParagraph.textContent = wordsText;  // Set the words with commas
      
        // Append the paragraph to the tokenizedWordsContainer
        tokenizedWordsContainer.appendChild(wordsParagraph);
      }
  

    //-----------------------------------------------------------------------
    // Step 2: Fetch GIFs for each word

    /*
    async function fetchAndDisplayGifs(searchTerms) {
      // Clear previous GIFs
      signsContainer.innerHTML = '';
  
      // Loop through each search term and fetch the GIF
      for (const term of searchTerms) {
        const gifUrl = await fetchGifForWord(term);
        if (gifUrl) {
          displayGif(gifUrl, term);  // Pass the word to display next to the GIF
        } else {
          alert(`No sign found for the word: ${term}`);
        }
      }
    }
  */ 
    // Fetch the GIF URL from the NTU SgSL Sign Bank for a given word
    async function fetchGifForWord(word) {
      const url = `https://blogs.ntu.edu.sg/sgslsignbank/word?frm-word=${encodeURIComponent(word)}`;
  
      try {
        const response = await fetch(url);
        const text = await response.text();
  
        // Use Cheerio (or similar parsing library) to parse the HTML and extract the GIF
        const gifUrl = extractGifUrlFromHtml(text);
        return gifUrl;
      } catch (error) {
        console.error('Error fetching the GIF:', error);
        return null;
      }
    }
  
    // Extract the GIF URL from the HTML content
    function extractGifUrlFromHtml(htmlContent) {
      // Create a new DOM element to load the HTML content
      const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
      
      // XPath to find the GIF element in the NTU SgSL page (based on your example path)
      const gifElement = doc.evaluate(
        '/html/body/div[1]/div/div/div/article/div/div/div/div[2]/div/div/div/div/div[2]/div/div[2]/div[1]/img', 
        doc, 
        null, 
        XPathResult.FIRST_ORDERED_NODE_TYPE, 
        null
      ).singleNodeValue;
      
      // Return the src attribute (GIF URL)
      return gifElement ? gifElement.src : null;
    }
  




    //-----------------------------------------------------------------------
    // Step 3: Display the GIF on the page with the word label
    function displayGif(gifUrl, word) {
      const gifContainer = document.createElement('div');
      const gifElement = document.createElement('img');
      gifElement.src = gifUrl;
      gifElement.alt = `Sign Language GIF for ${word}`;
      
      const wordLabel = document.createElement('p');
      wordLabel.textContent = `Signing for: ${word}`;
      
      gifContainer.appendChild(gifElement);
      gifContainer.appendChild(wordLabel);  // Add the label below the GIF
      
      signsContainer.appendChild(gifContainer);  // Add the GIF container to the signs container
    }
  
  });