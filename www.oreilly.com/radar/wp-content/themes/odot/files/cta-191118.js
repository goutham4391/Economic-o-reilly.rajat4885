var cta = document.getElementById('trial-cta');
var nls = document.getElementById('newsletter2');
var rightRailCreated = false;
var guidesCreated = false;
var rightRail = document.getElementById('right-rail');
var inlineContentList = [];

createRightRailListeners();

function createRightRailListeners() {
  if (cta || nls) {
    window.addEventListener('load', rightRailSetup, false);
    window.addEventListener('resize', debounce(function() {
      rightRailSetup();
    }, 200));
  }
}

function rightRailSetup() {
  if (widthCheck()) {
    if (rightRailCreated === false) {
      createRightRailBlock();
    };
    var rightRailBlock = document.getElementById('rightRailBlock');
    if (heightCheck(rightRailBlock) && ioCheck()) {
      setGuides(rightRailBlock);
    } else {
      unSetGuides(rightRailBlock);
    }
  }
  showHideRightRail(rightRailBlock,inlineContentList);
}

function widthCheck() {
  // check for css style only present at desktop widths
  var widthCheck = window.getComputedStyle(rightRail).getPropertyValue('width');
  return (widthCheck === "300px") ? true : false;
}

function createRightRailBlock() {
  var rightRailBlock = document.createElement('div');
  rightRailBlock.setAttribute ('id', 'rightRailBlock');
  rightRailBlock.classList.add('rightRailBlock');
  rightRailBlock.classList.add('unfixed-top');

  if (cta) {
    createRightRailCta(rightRailBlock);
    inlineContentList.push(cta);
  }
  if (nls) {
    createRightRailNls(rightRailBlock);
    inlineContentList.push(nls);
  }  
  rightRail.appendChild(rightRailBlock);
  rightRailCreated = true;
}

function createRightRailCta(rightRailBlock) {
  var rightRailCta = document.getElementById('trial-cta').cloneNode( true );
  rightRailCta.setAttribute ('id', 'rightRailCta');
  rightRailCta.classList.add('rightRail-cta');
  rightRailCta.classList.remove('inline-cta');
  rightRailCta.classList.remove('hidden');  
  rightRailBlock.appendChild(rightRailCta);
}

function createRightRailNls(rightRailBlock) {
  var rightRailNls = document.getElementById('newsletter2');
  rightRailNls.classList.add('rightRail-nls');
  rightRailNls.classList.remove('inline-nls');
  rightRailNls.classList.remove('hidden');
  rightRailBlock.appendChild(rightRailNls);
}

function showHideRightRail(rightRailBlock, inlineContentList) {
  if (widthCheck()) {
    rightRailBlock.classList.remove('hidden');
    inlineContentList.forEach(function(el) {
      el.classList.add('hidden')
    })
  } else {
    if (rightRailBlock) rightRailBlock.classList.add('hidden');
    inlineContentList.forEach(function(el) {
      el.classList.remove('hidden')
    })
  }
}

function heightCheck(rightRailBlock) { 
  var rightBlockHeight;
  if (rightRailBlock) {
    rightBlockHeight = calcOuterHeight(rightRailBlock);
  }
  var windowHeight = document.documentElement.clientHeight;
  if (windowHeight < (rightBlockHeight + 90)) {
    // height additions: 20px for padding/margins
    // + 70px for GDPR question
    return false;
  } else {
    var mainContent = document.getElementById('post-radar-content');
    var mainContentHeight = calcChildHeight(mainContent);
    // remove inline CTAs from height calculation;
    if (cta) {
      mainContentHeight -= calcOuterHeight(cta);
    };
    if (nls) {
      mainContentHeight -= calcOuterHeight(nls);
    };
    var featImg = document.getElementById('post-featured-image');
    var featImgHeight = 0;
    if (featImg) {
      featImgHeight = calcOuterHeight(featImg);
    };
    var heightDiff = mainContentHeight - featImgHeight - rightBlockHeight;
    return (heightDiff > 200) ? true : false;
  }
}
function calcChildHeight(parentElement) {
  if (parentElement.hasChildNodes()) {
    var children = parentElement.children;
    var totalHeight = 0;
    for (var i = 0; i < children.length; i++) {
      var childHeight = calcOuterHeight(children[i]);
      if (childHeight) {
        totalHeight += childHeight;
      }
    }
    return totalHeight;
  }
}
function calcOuterHeight(el) {
  var height = el.offsetHeight;
  var elementStyle = el.currentStyle || window.getComputedStyle(el);
  height += parseInt(elementStyle.marginTop)+ parseInt(elementStyle.marginBottom);
  return height;
}

function ioCheck() {
  return ('IntersectionObserver' in window) ? true : false;
}

function setGuides(rightRailBlock) {
  // creates guides for intersection observer
  if (!guidesCreated) {
    ['top','bottom'].forEach(createGuide); 
  };
  ['top','bottom'].forEach(setGuideSize);
  rightRailBlock.classList.add('fixed');
  rightRailBlock.classList.add('unfixed-top');
  initiateObservers(rightRailBlock);
  guidesCreated = true;
}
function unSetGuides(rightRailBlock) {
  if (guidesCreated === true) {
    rightRailBlock.classList.remove('unfixed-bottom');
    rightRailBlock.classList.remove('fixed');
    rightRailBlock.classList.add('unfixed-top');
    var topGuide = document.getElementById('topGuide');
    topGuide.parentNode.removeChild(topGuide);
    var bottomGuide = document.getElementById('bottomGuide');
    bottomGuide.parentNode.removeChild(bottomGuide);
  }
  guidesCreated = false;
}

function createGuide(position) {
  var guide = document.createElement('div');
  guide.id = position + 'Guide';
  placeGuide(position, guide);
  guidesCreated = true;
}
function placeGuide(position, guide) {
  if (position === 'top') {
    var skipToMain = document.getElementById("skipToMain");
    var parentNode = skipToMain.parentNode;
    parentNode.insertBefore(guide, skipToMain);
  } 
  else if (position === 'bottom') {
    document.body.appendChild(guide);
  }      
}

function setGuideSize(position) {
  guideHeight = calculateGuideHeight(position);
  var guideStyle = 'position: absolute; ' + position + ': 0; right: 0; z-index: -1; height: ' + guideHeight + 'px; width: 100%;' ;
  guideId = position + 'Guide';
  guide = document.getElementById(guideId);
  guide.setAttribute('style',guideStyle);
}
function calculateGuideHeight(position) {
  if (position === 'top') {
    var elementY = getDistanceFromTop(rightRail);
    var featImage = document.getElementById('post-featured-image');
    if (featImage) {      
      elementY += (featImage.offsetHeight + 20);
    }
    return (elementY - 40);
  } 
  else if (position === 'bottom') {
    var footerHeight = document.getElementById('footer').offsetHeight;
    var windowHeight = document.documentElement.clientHeight;
    var rightRailBlockHeight = document.getElementById('rightRailBlock').offsetHeight + 114; 
    return (footerHeight - (windowHeight - rightRailBlockHeight));     
  }
}
function getDistanceFromTop(element) {
  var yPos = 0;
  while(element) {
    yPos += (element.offsetTop);
    element = element.offsetParent;
  }
  return yPos;
}

function initiateObservers(rightRailBlock) {
  var config = {
    root: null, // sets the framing element to the viewport
    rootMargin: '0px',
    threshold: 0.0001
  };

  let observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(item){ 
      if (item.intersectionRatio > 0)  {
        if (item.target.id == 'bottomGuide') {
          rightRailBlock.classList.add('unfixed-bottom');
        } else if (item.target.id == 'topGuide') {
          rightRailBlock.classList.add('unfixed-top');
        };
      } else {
        if (item.target.id == 'bottomGuide') {
          rightRailBlock.classList.remove('unfixed-bottom');
        } else if ((item.target.id == 'topGuide')) {
          rightRailBlock.classList.remove('unfixed-top');
        };
      }
    });
  }, config);
  
  var topGuide = (document.getElementById('topGuide'));
  var bottomGuide = (document.getElementById('bottomGuide'));
  var ioElements = [topGuide, bottomGuide];
  ioElements.forEach(function(ioElement) {
    observer.observe(ioElement);
  });    
};

// debounce function to prevent continuous calls on window resize
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 200);
    if (callNow) func.apply(context, args);
  };
};

// .after method polyfill for IE9 and later
// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/after()/after().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('after')) {
      return;
    }
    Object.defineProperty(item, 'after', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function after() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.parentNode.insertBefore(docFrag, this.nextSibling);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);