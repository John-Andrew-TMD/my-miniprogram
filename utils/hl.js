/**
 * @param let string = '居民' 为原本要进行匹配的关键词
 * @param  let transformString = string.replace(/[.[*?+^$|()/]|\]|\\/g, '\\$&');
 * @param  let pattern = new RegExp(transformString, 'i');
 * @param  在使用的页面进行调用 ：highlightKeyword(document.getElementById('app'),pattern)
 */

/**
 * ② 高亮关键字
 * @param node - 节点
 * @param pattern - 用于匹配的正则表达式，就是把上面的pattern传进来
 */
function highlightKeyword(node, pattern) {
  // nodeType等于3表示是文本节点
  if (node.nodeType === 3) {
    // node.data为文本节点的文本内容
    let matchResult = node.data.match(pattern);
    // 有匹配上的话
    if (matchResult) {
      // 创建一个span节点，用来包裹住匹配到的关键词内容
      let highlightEl = document.createElement('span');
      // 不用类名来控制高亮，用自定义属性data-*来标识，比用类名更减少概率与原本内容重名，避免样式覆盖
      highlightEl.dataset.highlight = 'yes';
      // 从匹配到的初始位置开始截断到原本节点末尾，产生新的文本节点
      let matchNode = node.splitText(matchResult.index);

      // 从新的文本节点中再次截断，按照匹配到的关键词的长度开始截断，

      // 此时0-length之间的文本作为matchNode的文本内容

      matchNode.splitText(matchResult[0].length);

      // 对matchNode这个文本节点的内容（即匹配到的关键词内容）创建出一个新的文本节点出来

      let highlightTextNode = document.createTextNode(matchNode.data);

      // 插入到创建的span节点中

      highlightEl.appendChild(highlightTextNode);

      // 把原本matchNode这个节点替换成用于标记高亮的span节点

      matchNode.parentNode.replaceChild(highlightEl, matchNode);
    }
  }

  // 如果是元素节点 且 不是script、style元素 且 不是已经标记过高亮的元素

  // 至于要区分什么元素里的内容不是你想要高亮的，可自己补充，这里的script和style是最基础的了

  // 不是已经标记过高亮的元素作为条件之一的理由是，避免进入死循环，一直往里套span标签
  else if ( node.nodeType === 1 && !/script|style|data-v-/.test(node.tagName.toLowerCase()) &&
    node.dataset.highlight !== 'yes' 
  ) {
    // 遍历该节点的所有子孙节点，找出文本节点进行高亮标记

    let childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      highlightKeyword(childNodes[i], pattern);
    }
  }
}

function searchHighlightKeyword(node, pattern) {
  // nodeType等于3表示是文本节点
  console.log(node)
  let matchResult = node.innerHTML.match(pattern);
  node.fields({
    size: true,
	dataset:true,
    scrollOffset: true
  }, data => {
    // if (node.nodeType === 3) {
      // node.data为文本节点的文本内容
	 
      // 有匹配上的话
      if (matchResult) {
        let highlightEl = document.createElement('span');
        highlightEl.setAttribute('ref','searhighlight')
        highlightEl.className = 'kwdclass'
        let matchNode = node.splitText(matchResult.index);
        matchNode.splitText(matchResult[0].length);
        let highlightTextNode = document.createTextNode(matchNode.data);
        highlightEl.appendChild(highlightTextNode);
    
        matchNode.parentNode.replaceChild(highlightEl, matchNode);
      }
    // }
    else if (node.nodeType === 1 && !/script|style/.test(node.tagName.toLowerCase()) && node.getAttribute('ref')!=='searhighlight') {
      // 遍历该节点的所有子孙节点，找出文本节点进行高亮标记
      let childNodes = node.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        searchHighlightKeyword(childNodes[i], pattern);
      }
    }
  }).exec();
}

export { highlightKeyword , searchHighlightKeyword }