window.onload = () => {
  const btn = document.getElementById('button')
  const paper = document.getElementsByClassName('paper')[0]
  const calc = e => {
    paper.innerHTML = ""

    const f = document.getElementById('first').value
    const s = document.getElementById('second').value

    if(f == '' || s == '') return alert('入力してください')

    const maxwidth = f.length + s.length + 1

    paper.style.width = `${maxwidth * 48}px`

    ;[...Array(maxwidth - f.length)].forEach(_ => paper.appendChild(createCell('','','red')))
    f.split('').forEach(c => paper.appendChild(createCell(c,'','red')))

    ;[...Array(maxwidth - s.length)].forEach(_ => paper.appendChild(createCell('','','red')))
    s.split('').forEach(c => paper.appendChild(createCell(c,'','red')))

    const {results, moveups} = multiply(f,s)
    moveups.map(m => {
      m[0] = 0
      return m
    })

    results.forEach((r,i) => {
      for (let i = 0; r.length - i > f.length; i++) {
        if(r[i] == '0')
          r[i] = ''
        else
          break
      }

      ;[...Array(maxwidth - r.length - i)].forEach(_ => paper.appendChild(createCell('','','green')))
      r.forEach((c,ii) => paper.appendChild(createCell(c,moveups[i][ii] == '0' ? '' : moveups[i][ii] ,'green')))
      ;[...Array(maxwidth - (maxwidth - r.length - i) - r.length)].forEach(_ => paper.appendChild(createCell('','','green')))
    })

    const {sums, sum_moveups} = sum(results, maxwidth)
    console.log(sum_moveups)

    for (let i = 0; i < sums.length; i++) {
      if(sums[i] == '0')
        sums[i] = ''
      else
        break
    }

    sums.forEach((c,i) => {
      paper.appendChild(createCell(c,sum_moveups[i] == '0' ? '' : sum_moveups[i] , 'blue'))
    })
  }

  btn.onclick = calc
  window.onkeypress = e => {
    if(e.keyCode == 13) calc()
  }
}

const transpose = a => a[0].map((_, c) => a.map(r => r[c]));

function sum(re,max) {
  let res = re.slice()
  res = transpose(res.map((r,i) => {
    ;[...Array(max-r.length-i)].forEach(_ => r.unshift('0'))
    ;[...Array(i)].forEach(_ => r.push('0'))
    return r.reverse()
  }))

  const results = []
  const moveups = ['0']
  let moveup = '0'

  res.forEach((list,ii) => {
    let s = list.reduce((p,c) => {
      return Number(p) + Number(c)
    })
    const result = `${s+Number(moveup)}`.padStart(2,'0')
    moveup = result.substr(0,1) || '0'
    results.push(result.substr(1,1))
    moveups.push(moveup)
  })
  moveups.pop()

  return {
    sums: results.reverse(),
    sum_moveups: moveups.reverse()
  }
}

function createCell(n = '',m = '', color) {
  const div = document.createElement('div')
  div.classList.add('cell')
  div.classList.add(color)
  const number = document.createElement('span')
  number.classList.add('number')
  number.innerText = n

  const mini = document.createElement('span')
  mini.classList.add('mini')
  mini.innerText = m
  div.appendChild(number)
  div.appendChild(mini)
  return div
}

function multiply(first, second) {
  const first_array = first.split('')
  const second_array = second.split('')
  
  first_array.reverse()
  second_array.reverse()
  
  let moveup = '0'
  const results = []
  const moveups = []
  
  second_array.forEach((i,ii) => {

    results[ii] = results[ii] == undefined ? [] : results[ii]
    moveups[ii] = moveups[ii] == undefined ? [] : moveups[ii]

    moveups[ii].push('0')
    
    first_array.forEach(j => {
      const result = `${i*j+Number(moveup)}`.padStart(2,'0')
      moveup = result.substr(0,1) || '0'
      results[ii].push(result.substr(1,1))
      moveups[ii].push(moveup)
    })
    results[ii].push(moveup)
    moveup = 0
  })

  return {
    results: results.map(i => i.reverse()),
    moveups: moveups.map(i => i.reverse())
  }
}

// 幅 = 桁数1 + 桁数2
// 高さ = 桁数2 + 3