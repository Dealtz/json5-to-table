const { jsonToHTMLTable, jsonToExcel } = JSONToTable

props_javascript = [
  { key: 'a' },
  { 
    key: 'b', 
    props: [ { key: 'd' }, { key: 'e' } ]
  },
  { 
    key: 'c', 
    props: [ { key: 'd' }, { key: 'e' }, { key: 'f' } ]
  }
]
props_json = '[{"key":"a"},{"key":"b","props":[{"key":"d"},{"key":"e"}]},{"key":"c","props":[{"key":"d"},{"key":"e"},{"key":"f"}]}]'
data_javascript = [
  {
    a: 1,
    b: [
      { d: 2, e: 3 },
      { d: 4, e: 5 }
    ],
    c: [
      { d: 6, e: 7, f: 8 },
      { d: 9, e: 10, f: 11 },
      { d: 12, e: 13, f: 14 }
    ]
  }
]
data_json = '[{"a":1,"b":[{"d":2,"e":3},{"d":4,"e":5}],"c":[{"d":6,"e":7,"f":8},{"d":9,"e":10,"f":11},{"d":12,"e":13,"f":14}]}]'
document.getElementById('input_json').defaultValue = data_json
document.getElementById('input_javascript').defaultValue = JSON.stringify(props_javascript).replace(/"(\w+)":/g,'$1:').replace(/:"(\w+)"/g,':\'$1\'')
document.getElementById('json_space').defaultValue = 0
document.getElementById('javascript_space').defaultValue = 0
document.getElementById('input_data').defaultValue = data_json
document.getElementById('input_props').defaultValue = props_json

document.getElementById('html.toSource').addEventListener('click', function () {
  data = document.getElementById('input_data').value
  props = document.getElementById('input_props').value
  if ( data != "" ){
    try {
      if ( props != "" ){
        document.getElementById('input_data').value = JSON.stringify(JSON.parse(data), null, 2)
        document.getElementById('input_props').value = JSON.stringify(JSON.parse(props), null, 2)
        source = jsonToHTMLTable(JSON.parse(data), JSON.parse(props), { format: 'source' })
      } else {
        document.getElementById('input_data').value = JSON.stringify(JSON.parse(data), null, 0)
        source = jsonToHTMLTable(JSON.parse(data), props, { format: 'source' })
      }
    } catch (e) {
      alert("JSON 数据错误："+e)
    }
  const sourceContainer = document.getElementById('html.sourceContainer')
  sourceContainer.innerText = source//JSON.stringify(data)+"<br>"+JSON.stringify(props)
  } else {
    alert("Data不能为空！")
  }
})

document.getElementById('html.toDom').addEventListener('click', function () {
  data = document.getElementById('input_data').value
  props = document.getElementById('input_props').value
  if ( data != "" ){
    try {
      if ( props != "" ){
        document.getElementById('input_data').value = JSON.stringify(JSON.parse(data), null, 2)
        document.getElementById('input_props').value = JSON.stringify(JSON.parse(props), null, 2)
        dom = jsonToHTMLTable(JSON.parse(data), JSON.parse(props), { format: 'dom' })
      } else {
        document.getElementById('input_data').value = JSON.stringify(JSON.parse(data), null, 2)
        dom = jsonToHTMLTable(JSON.parse(data), props, { format: 'dom' })
      }
    } catch (e) {
      alert("JSON 数据错误："+e)
    }
    const domContainer = document.getElementById('html.domContainer')
    domContainer.append(dom)
  } else {
    alert("Data不能为空！")
  }
})

document.getElementById('excel.exportFile').addEventListener('click', function () {
  data = document.getElementById('input_data').value
  props = document.getElementById('input_props').value
  if ( data != "" ){
    try {
      if ( props != "" ){
        document.getElementById('input_data').value = JSON.stringify(JSON.parse(data), null, 2)
        document.getElementById('input_props').value = JSON.stringify(JSON.parse(props), null, 2)
        jsonToExcel(JSON.parse(data), JSON.parse(props), 'export.xlsx')
      } else {
        document.getElementById('input_data').value = JSON.stringify(JSON.parse(data), null, 2)
        jsonToExcel(JSON.parse(data), null, 'export.xlsx')
      }
    } catch (e) {
      alert("JSON 数据错误："+e)
    }
  } else {
    alert("Data不能为空！")
  }
})

document.getElementById('excel.generateBlob').addEventListener('click', function () {
  data = document.getElementById('input_data').value
  props = document.getElementById('input_props').value
  if ( data != "" ){
    try {
      if ( props != "" ){
        document.getElementById('input_data').value = JSON.stringify(JSON.parse(data), null, 2)
        document.getElementById('input_props').value = JSON.stringify(JSON.parse(props), null, 2)
        blob = jsonToExcel(JSON.parse(data), JSON.parse(props))
      } else {
        document.getElementById('input_data').value = JSON.stringify(JSON.parse(data), null, 2)
        blob = jsonToExcel(JSON.parse(data), null)
      }
    } catch (e) {
      alert("JSON 数据错误："+e)
    }
    console.log(blob)
  } else {
    alert("Data不能为空！")
  }
})

document.getElementById('html.toJavascript').addEventListener('click', function () {
  data = document.getElementById('input_json').value
  try {
    data = JSON.stringify(JSON.parse(data), null, parseInt(document.getElementById('javascript_space').value))
  } catch (e) {
      alert("JSON 数据错误："+e)
    }
  data = data.replace(/"(\w+)":/g,'$1:') //已知bug，w+只能是word，中间不能参杂符号和下划线等
  document.getElementById('input_javascript').value = data
})

document.getElementById('html.toJson').addEventListener('click', function () {
  var data = document.getElementById('input_javascript').value.replace(/'/g,'"')
  data = data.replace(/(\w+):/g,'"$1":')
  try {
    data = JSON.stringify(JSON.parse(data), null, parseInt(document.getElementById('json_space').value))
  } catch (e) {
      alert("JSON 数据错误："+e)
    }
  document.getElementById('input_json').value = data
})
function jsonTocsv() {
  var content = document.getElementById('input_json').value;
  if (content.trim().length == 0) {
    return false;
  }
  try {
    var jsonStr = content;
    var json = JSON.parse(jsonStr);
    var csv = jsonTocsvbyjson(json);
    document.getElementById('input_json').value = csv;	
  } catch (e) {
    alert("JSON 数据错误："+e);
  }
}
function jsonTocsvbyjson(data) {
  arr = [];
  flag = true;
  var header = "";
  var content = "";
  var headFlag = true;
  try {
    var type1 = typeof data;
    if (type1 != "object") {
      data = processJSON($.parseJSON(data));
    } else {
      data = processJSON(data);
    }
  } catch (e) {
    alert("Error in Convert : add proper input format");
    return false;
  }
  $.each(data, function(k, value) {
    if (k % 2 == 0) {
      if (headFlag) {
        if (value != "end") {
          header += value + ",";
        } else {
          // remove last colon from string
          header = header.substring(0, header.length - 1);
          headFlag = false;
        }
      }
    } else {
      if (value != "end") {
        var temp = data[k - 1];
        if (header.search(temp) != -1) {
          content += value + ",";
        }
      } else {
        // remove last colon from string
        content = content.substring(0, content.length - 1);
        content += "\n";
      }
    }
  });
  return (header + "\n" + content);
}
function processJSON(data) {
  $.each(data, function(k, data1) {
    var type1 = typeof data1;
    if (type1 == "object") {
      flag = false;
      processJSON(data1);
      arr.push("end");
      arr.push("end");
    } else {
      arr.push(k, data1);
    }
  });
  return arr;
}