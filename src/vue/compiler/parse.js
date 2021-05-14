// 以下为源码的正则  对正则表达式不清楚的同学可以参考小编之前写的文章(前端进阶高薪必看 - 正则篇);
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"

let root, currentParent  //代表跟节点 和 当前父节点
// 栈结构  表示开始和结束标签
let stack = []
// 标识元素和文本type

const ELEMENT_TYPE = 1
const TEXT_TYPE = 3
// 生成 ast方法
function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}

//对开始标签进行处理
function handleStartTag({ tagName, attrs }) {
  let element = createASTElement(tagName, attrs)
  if(!root){
    root = element
  }
  
  if (element.tag === 'input') {
    element.parent = currentParent
    currentParent.children.push(element)
  } else {
    currentParent = element
    stack.push(element)
  }
}

//对结束标签进行处理
function handleEndTag({ tagName, attrs }) {
  // 栈结构【】
  let element = stack.pop()
  // 当前父元素就是栈顶的上一个元素
  currentParent = stack[stack.length - 1]
  
  if(currentParent) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}

//对文本进行处理
function handleChars(text) {
  //去掉空格
  text = text.replace(/\s/g, "")
  if(text) {
    currentParent.children.push({
      type: TEXT_TYPE,
      text
    })
  }
}

// 解析标签生成ast核心

export function parse(html) {
  while (html) {
    //查找 <
    let textEnd = html.indexOf("<")
    // 如果< 在第一个 name证明接下来就是一个标签 
    if(textEnd === 0) {
      //如果是开始标签， 解析
      const startTagMatch = parseStartTag()
      if(startTagMatch){
        handleStartTag(startTagMatch)
        continue
      }
      // 匹配结束标签</
      const endTagMatch = html.match(endTag);
      if(endTagMatch) {
        advance(endTagMatch[0].length)
        handleEndTag(endTagMatch)
        continue
      }
    }
    let text
    if (textEnd >= 0) {
      // 获取文本
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      handleChars(text);
    }
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      // 匹配到开始标签， 就截掉
      advance(start[0].length)
      
      // 开始匹配属性
      // end代表结束符号> 如果不是匹配到了结束标签
      // attr 表示匹配的属性
      let end, attr;
      while(
        !(end = html.match(startTagClose)) && 
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        attr = {
          name: attr[1],
          value: attr[3] || attr[4] || attr[5], //这里是因为正则捕获支持双引号 单引号 和无引号的属性值
        }
        match.attrs.push(attr)
      }
      if(end){
        advance(1)
        return match
      }
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  return root
}