import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() dataset:any;

  // Simpler colGroups
  colsMap: any = []

  groups: any = [
    [
      { header: "ABC", colspan: 3, rowspan: 1 },
      { header: "DEF", colspan: 3, rowspan: 1 },
      // { header: "G", colspan: 1, rowspan: 3 },
    ],
    [
      { header: "AB", colspan: 2, rowspan: 1 },
      { header: "C", colspan: 1, rowspan: 2 },
      { header: "DE", colspan: 2, rowspan: 1 },
      { header: "F", colspan: 1, rowspan: 2 },
    ],
  ]

  cols: any = [
    { header: 'A' }, { header: 'B' }, { header: 'C' }, { header: 'D' }, { header: 'E' }, { header: 'F' }, { header: 'G' },
  ]

  displayedCols: any = []

  getGroup(i: number) {
    this.colsMap.forEach((row: any) => {
      console.log(row[i])
    })
  }

  hideCol(i: number) {
    this.displayedCols = this.displayedCols.filter((col: any, idx: number) => idx !== i)

  }

  ngOnInit(): void {

    this.groups.forEach((group: any) => {
      let row: any = [];
      // this.colsMap.push([...Array(row)])
      group.forEach((th: any) => {
        row = [...row, ...Array(th.colspan).fill(th.header)]
      })
      this.colsMap.push(row)
    })
    this.displayedCols = [...this.cols];

    fetch('../assets/sample-data.json')
    .then((res: any) => res.json())
    .then((data: any) => {
      this.dataset = data;
      this.columns.forEach((col: any) => {
        if (col.type !== "OPERATION") return;
        this.dataset.forEach((item: any) => this.onOperationChange(item, col.field))
      })
      // console.log(this.columns)
      // this.colGroups.forEach(item => {
      //   console.log(item)
      //   if (item?.children) {
      //     item.children.forEach(item => {
      //       console.log(item)
      //       if (item?.children) {
      //         item.children.forEach(item => {
      //           console.log(item)
      //         })
      //       }
      //     })
      //   }
      // })

      this.generateHeaderGroups()

      // setInterval(() => {
      //   const random = new Date().getMilliseconds().toString()[0];
      //   console.log(this.columns[Number(random) - 1])
      //   this.columns = this.columns.filter((col: any, i: number) => i !== Number(random) - 1);
      //   this.generateHeaderGroups();
      // }, 2000);



    })

  }



  //

  constructor() {

  }

  headerGroups: any = [[]];

  generateHeaderGroups() {
    const headers: any = [];
    this.columns.forEach((col: any, i: number) => {
      if (i === 0) {
        headers.push({
          header: col.headerGroup,
          colspan: 1,
        });
      } else if (this.columns[i - 1].headerGroup !== col.headerGroup) {
        headers.push({
          header: col.headerGroup,
          colspan: 1,
        });
      } else {
        headers[headers.length - 1].colspan += 1;
      }
    });
    this.headerGroups[0] = headers;
  }

  // MORE HEADER COLGROUPS
  colGroups = [
      {
        header: 'Highest',
        children: [
          {
            header: 'Mid ABC',
            children: [
              { header: 'product', visible: true },
              { header: 'weight', visible: true },
            ]
          },
          {
            header: 'Mid DEF',
            children: [
              { header: 'price', visible: true },
              { header: 'kgPrice', visible: true },
            ]
          },
          {
            header: 'Mid GHI',
            children: [
              { header: 'discount', visible: true },
              { header: 'salePrice', visible: true },
              { header: 'saleKgPrice', visible: true },
            ]
          }
        ]
      }
  ]


  columns: any[] = [
    { field: "product", header: "Product", type: "TEXT"},
    { field: "weight", header: "Weight", type: "NUMBER", headerGroup: "Product details" },
    { field: "price", header: "Price", type: "NUMBER", headerGroup: "Base price", options: {
      highlightColor: "#fce7f3"
    } },
    { field: "kgPrice", header: "Price/kg", type: "OPERATION", headerGroup: "Base price" },
    { field: "discount", header: "Discount (%)", type: "NUMBER", headerGroup: "Promo" },
    { field: "salePrice", header: "Sale price", type: "OPERATION", headerGroup: "Promo" },
    { field: "saleKgPrice", header: "Sale price/kg", type: "OPERATION", headerGroup: "Promo" },
  ]

  log(LOG: any) {
    console.log(LOG)
  }

  getCellValue(col: number, row: number) {
    const cell = this.dataset[row][this.columns[col].field]
    return cell;
  }

  setCellValue(col: number, row: number, val: any) {
    this.dataset[row][this.columns[col].field] = val;
    this.onCellValueChange(this.dataset[row], col, row)
  }

  // Column operations
  inputDialogVisible: boolean = false;
  selectedColumn: any;
  columnInput: string = '';
  onContextMenu(e: Event, col: any, index: number) {
    e.preventDefault()

    // col.index = index;
    // this.columnInput = '';
    // this.selectedColumn = col;
    // this.inputDialogVisible = true;
  }

  contextMenuItems = [
    {label: 'View', icon: 'pi pi-fw pi-search', command: () => this.log('view')},
        {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.log('delete')}
];

  onTableHeaderContextMenu(e: MouseEvent, header: string, isHeaderGroup: boolean) {
    if (e.ctrlKey) {
      e.preventDefault();
      const headerType = isHeaderGroup ? 'headerGroup' : 'header';
      this.columns = this.columns.filter((col: any) => col[headerType] !== header)
      this.generateHeaderGroups()
      this.hoveredHeaderGroup = '';
    }
  }

  hoveredHeaderGroup: string = '';
  onTableHeaderHover(e: MouseEvent, header: string, isHeaderGroup: boolean) {
    this.hoveredHeaderGroup = e.ctrlKey ? header : '';
  }

  setColumnValue(form: HTMLFormElement) {
    const val = form['newColumnInput'].value;
    form.reset();
    if (this.selectedColumn.type === 'OPERATION') {
      for (let i = 0; i < this.dataset.length; i++) {
        this.dataset[i][this.selectedColumn.field].operation = val
        this.onOperationChange(this.dataset[i], this.selectedColumn.field)
      }
    } else {
      for (let i = 0; i < this.dataset.length; i++) {
        this.setCellValue(this.selectedColumn.index, i, val)
      }
    }

  }
  //

  checkIfOperation(val: any) {
    return val[0] === "=" && val.includes('(') && val.includes(')');
  }




  onOperationChange(item: any, field: string) {
    const element = this.dataset.find((el: any) => el === item)
    let operation = element[field].operation;

    this.columns.forEach((col: any) => {
      if (col.field === field) return;
      operation = operation.replaceAll(col.field, item[col.field])
    })
    const regexp = /^[A-Za-z]/;
    if (regexp.test(operation)) return;

    const result = this.operate(operation)()

    element[field].value = result.toFixed(2);
  }

  operate(op: string): any {
    const regexp = /^[A-Za-z]+$/;
    if (regexp.test(op)) return;
    return Function('return ' + op)
  }

  onCellValueChange(item: any, x: number, y: number) {
      this.columns.forEach((col: any) => {
        if (col.type !== "OPERATION") return;
        this.onOperationChange(item, col.field)
      })

    // let val = this.getCellValue(x, y);
    // if (!val) return;
    // if (!this.checkIfOperation(val)) return;

    // val = val.slice(1)

    // const operation = val.split('(')[0];

    // if (operation === "ADD" && val.includes('+')) {
    //   const sum = this.operations.ADD(val, item, x, y);
    //   if (Number.isNaN(sum)) {
    //     console.error(val, sum)
    //   } else {
    //     this.setCellValue(x, y, sum)
    //   }
    // }

    // if (operation === "SUBSTRACT" && val.includes('-')) {
    //   const difference = this.operations.SUBSTRACT(val, item, x, y);
    //   if (Number.isNaN(difference)) {
    //     console.error(val, difference)
    //   } else {
    //     this.setCellValue(x, y, difference)
    //   }
    // }

    // if (operation === "MULTIPLY" && val.includes('*')) {
    //   const product = this.operations.MULTIPLY(val, item, x, y);
    //   if (Number.isNaN(product)) {
    //     console.error(val, product)
    //   } else {
    //     this.setCellValue(x, y, product)
    //   }
    // }

    // if (operation === "DIVIDE" && val.includes('/')) {
    //   const quotient = this.operations.DIVIDE(val, item, x, y);
    //   if (Number.isNaN(quotient)) {
    //     console.error(val, quotient)
    //   } else {
    //     this.setCellValue(x, y, quotient)
    //   }
    // }
  }
  // operations = {
  //   ADD(op: string, item: any, x: number, y: number): number {
  //     const terms = op.split('(')[1].split(')')[0].split('+');
  //       if (terms.length <= 1) return NaN;
  //       let sum = 0;
  //       for (let i = 0; i < terms.length; i++) {
  //         let term = item[terms[i]] ? Number(item[terms[i]]) : Number(terms[i]);
  //         sum = term + sum;
  //       }
  //       return Number(sum.toFixed(2));
  //   },
  //   SUBSTRACT(op: string, item: any, x: number, y: number): number {
  //     const terms = op.split('(')[1].split(')')[0].split('-');
  //       if (terms.length <= 1) return NaN;
  //       let difference = 0;
  //       for (let i = 0; i < terms.length; i++) {
  //         let term = item[terms[i]] ? Number(item[terms[i]]) : Number(terms[i]);
  //         difference = i === 0 ? term : difference - term;
  //       }
  //       return Number(difference.toFixed(2));
  //   },
  //   MULTIPLY(op: string, item: any, x: number, y: number): number {
  //     const factors = op.split('(')[1].split(')')[0].split('*')
  //       if (factors.length <= 1) return NaN;
  //       let product = 1;
  //       for (let i = 0; i < factors.length; i++) {
  //         let factor = item[factors[i]] ? Number(item[factors[i]]) : Number(factors[i]);
  //         product = factor * product;
  //       }
  //       return Number(product.toFixed(2));
  //   },
  //   DIVIDE(op: string, item: any, x: number, y: number): number {
  //     const factors = op.split('(')[1].split(')')[0].split('/')
  //       if (factors.length <= 1) return NaN;
  //       let quotient = NaN;
  //       for (let i = 0; i < factors.length; i++) {
  //         let factor = item[factors[i]] ? Number(item[factors[i]]) : Number(factors[i]);
  //         quotient = i === 0 ? factor : quotient / factor;
  //       }
  //       return Number(quotient.toFixed(2));
  //   }
  // }

}
