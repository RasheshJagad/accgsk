import * as React from 'react';
import styles from './ServiceProducts.module.scss';
import type { IServiceProductsProps } from './IServiceProductsProps';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/content-types";
import "@pnp/sp/fields";
import { Checkbox, DefaultButton, Dialog, DialogFooter, Image, TextField, TooltipHost } from '@fluentui/react';
import moment from 'moment';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
require('../../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
const backbtn: any = require('../assets/backBtn.png');

const ServiceProducts: React.FunctionComponent<IServiceProductsProps> = (props: IServiceProductsProps) => {
  const defaultLookups: string[] = ["User", "UserMulti", "Lookup", "LookupMulti"];
  const [selectedTileFields, setSelectedTileFields] = React.useState<any[]>([]);
  const [selectedDialogFields, setSelectedDialogFields] = React.useState<any[]>([]);
  const [productItems, setProductItems] = React.useState<any[]>([]);
  const [productDisplayItems, setProductDisplayItems] = React.useState<any[]>([]);
  const [allProductItems, setAllProductItems] = React.useState<any[]>([]);
  const [textFieldValue, setTextFieldValue] = React.useState<string>('');
  const [hideDialog, setHideDialog] = React.useState<boolean>(true);
  const [dialogItemId, setDialogItemId] = React.useState<number>(0);
  const [dialogItem, setDialogItem] = React.useState<any>(null);
  const [filterShow, setFilterShow] = React.useState<boolean>(false)
  const [buChoices, setBUChoices] = React.useState<any[]>([]);
  const [stateData, setStateData] = React.useState<any[]>([]);
  const iconProps = { iconName: 'SearchArt64' };

  const getAllFields = async () => {
    const _commonFields: any[] = [];
    const _dialogFields: any[] = [];
    const sp = spfi().using(SPFx(props.context));
    const _allFields = await sp.web.contentTypes.getById('0x0100B5637EA6C46B4FCBB4CACABD88E6C6EF').fields();
    if (typeof props.tileFields !== typeof undefined) {
      const tempFields = props.tileFields.filter(l => l.field !== null).map((f, i) => f.field);
      tempFields.sort((a, b) => a.order - b.order);
      tempFields.forEach(tf => {
        const tempItem = _allFields.filter(f => f.InternalName === tf.key && tf.ischecked);
        if (tempItem.length > 0) {
          _commonFields.push(tempItem[0]);
        }
      });
    }
    else {
      _commonFields.push(_allFields.filter(f => f.InternalName === "Title"));
    }
    if (typeof props.dialogFields !== typeof undefined) {
      const tempFields = props.dialogFields.filter(l => l.field !== null).map((f, i) => f.field);
      tempFields.sort((a, b) => a.order - b.order);
      tempFields.forEach(tf => {
        const tempItem = _allFields.filter(f => f.InternalName === tf.key && tf.ischecked);
        if (tempItem.length > 0) {
          _dialogFields.push(tempItem[0]);
        }
      });
    }
    else {
      _dialogFields.push(_allFields.filter(f => f.InternalName === "Title"));
    }
    setSelectedTileFields(_commonFields);
    setSelectedDialogFields(_dialogFields);
  }

  const getAllProducts = async () => {
    const selectTileFields: string[] = [];
    const expandTileFields: string[] = [];
    selectTileFields.push(`*`);
    selectedTileFields.forEach(stf => {
      if (defaultLookups.indexOf(stf.TypeAsString) >= 0) {
        selectTileFields.push(`${stf.InternalName}/Title`);
        expandTileFields.push(stf.InternalName);
      }
      else {
        selectTileFields.push(stf.InternalName);
      }
    });
    const sp = spfi().using(SPFx(props.context));
    const vItems = await sp.web.lists.getByTitle('Products').items.select(selectTileFields.join(',')).expand(expandTileFields.join(',')).top(1000)();
    const _Ps: any[] = [];
    vItems.forEach(p => {
      _Ps.push({ product: p, stateColor: '' });
    });
    setProductDisplayItems(_Ps);
    setProductItems(vItems);
    setAllProductItems(vItems);
  }

  const getSelectedProduct = async () => {
    const selectTileFields: string[] = [];
    const expandTileFields: string[] = [];
    selectTileFields.push(`*`);
    selectedDialogFields.forEach(stf => {
      if (defaultLookups.indexOf(stf.TypeAsString) >= 0) {
        selectTileFields.push(`${stf.InternalName}/Title`);
        expandTileFields.push(stf.InternalName);
      }
      else {
        selectTileFields.push(stf.InternalName);
      }
    });
    const sp = spfi().using(SPFx(props.context));
    const vItem = await sp.web.lists.getByTitle('Products').items.getById(dialogItemId).select(selectTileFields.join(',')).expand(expandTileFields.join(','))();
    setDialogItem(vItem);
    setHideDialog(false);
  }

  React.useEffect(() => {
    getAllFields();
    getBusinessUnits();
  }, []);
  React.useEffect(() => {
    if (selectedTileFields.length > 0) {
      getAllProducts();
    }
  }, [selectedTileFields]);
  React.useEffect(() => {
    if (dialogItemId !== 0) {
      getSelectedProduct();
      setHideDialog(false);
    }
  }, [dialogItemId]);

  const onChangeTextFieldValue = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setTextFieldValue(newValue || '');
    },
    []
  );

  // React.useEffect(() => {
  //   const _productItems = productItems.filter(pi => JSON.stringify(pi).indexOf(textFieldValue) >= 0 || textFieldValue === '');
  //   setProductItems(_productItems);
  // }, [textFieldValue]);

  const onCardSelect = (itemId: number) => {
    setDialogItemId(itemId);
  }

  const getFieldValue = (stf: any, _: any): string => {
    if (_ === null || typeof _[`${stf.InternalName}`] == typeof undefined || _[`${stf.InternalName}`] === null) return '';
    let returnValue = '';
    switch (stf.TypeAsString) {
      case "User":
        returnValue = `<span>${_[`${stf.InternalName}`].Title}</span>`;
        break;
      case "UserMulti":
        console.log(_[stf.InternalName]);
        const userValues: string[] = [];
        try {
          _[stf.InternalName].forEach((lv: any) => {
            userValues.push(lv.Title);
          });
        } catch (e) { console.log(e); }
        returnValue = userValues.join('; ');
        break;
      case "Lookup":
        returnValue = `<span>${_[`${stf.InternalName}`][stf.LookupField]}</span>`;
        break;
      case "LookupMulti":
        const lookupValues: string[] = [];
        try {
          _[stf.InternalName].forEach((lv: any) => {
            lookupValues.push(lv[stf.LookupField]);
          });
          returnValue = lookupValues.join('; ');
        } catch { }
        break;
      case "DateTime":
        returnValue = `<span>${moment(_[`${stf.InternalName}`]).format("MM/DD/YYYY")}</span>`;
        break;
      case "URL":
        returnValue = `<a href="${_[`${stf.InternalName}`].Url}">${(_[`${stf.InternalName}`].Url === _[`${stf.InternalName}`]['Description'] || _[`${stf.InternalName}`].Url === '') ? 'Go To Page' : _[`${stf.InternalName}`].Description}</a>`;
        break;
      case "MultiChoice":
        returnValue = `<span>${_[`${stf.InternalName}`].join('; ')}</span>`;
        break;
      case "TaxonomyFieldType":
        returnValue = `<span>${_[`${stf.InternalName}`].Label}</span>`
        break;
      case "TaxonomyFieldTypeMulti":
        const termValues: string[] = [];
        try {
          _[stf.InternalName].forEach((lv: any) => {
            termValues.push(lv.Label);
          });
        } catch { }
        returnValue = termValues.join('; ');
        break;
      case "Boolean":
        returnValue = `<span>${(_[`${stf.InternalName}`]) ? 'Yes' : 'No'}</span>`
        break;
      default:
        returnValue = `<span>${_[`${stf.InternalName}`]}</span>`
        break;
    }
    if (returnValue === null || returnValue === 'null') returnValue = '';
    return returnValue;
  }

  const filterByBUs = () => {
    if (buChoices.some(bu => bu.ischecked)) {
      const buSelected = buChoices.filter(bu => bu.ischecked);
      const _filteredItems = allProductItems.filter(p => buSelected.some(bu => p['ProductBusinessUnit'] === bu.key));
      setProductItems(_filteredItems);
    }
    else {
      setProductItems(allProductItems);
    }
  }

  const getBusinessUnits = async () => {
    const sp = spfi().using(SPFx(props.context));
    const _field = await sp.web.lists.getByTitle('Products').fields.filter(`InternalName eq 'ProductBusinessUnit'`)();//.getByInternalNameOrTitle('ProductBusinessUnit')();
    if (_field.length > 0) {
      const choices = _field[0].Choices as string[];
      const _bus: any[] = [];
      choices.forEach(choice => {
        _bus.push({ key: choice, ischecked: false });
      });
      setBUChoices(_bus);
    }
  }

  // const getProductsFlag = async () => {
  //   const _products: string[] = [];
  //   productItems.forEach(pi => {
  //     _products.push(pi.Title.trim());
  //   });
  //   const requestBody = { "products": _products.join(',') };
  //   const httpClientOptions: IHttpClientOptions = {
  //     body: JSON.stringify(requestBody),
  //     headers: new Headers({ 'Content-Type': 'application/json' })
  //   };
  //   props.context.httpClient.post(props.apiPath, HttpClient.configurations.v1, httpClientOptions).then((response: HttpClientResponse) => {
  //     console.log(response);
  //     if (response.ok) {
  //       response.json().then((data) => {
  //         setStateData(data.value.Table1);
  //       });
  //     }
  //   });
  // }
  const getSecuredProductsFlag = async () => {
    const _products: string[] = [];
    productItems.forEach(pi => {
      _products.push(pi.Title.trim());
    });
    props.context.aadHttpClientFactory.getClient('https://service.flow.microsoft.com/')
      .then((client: AadHttpClient) => {
        client.post(props.apiPath, AadHttpClient.configurations.v1, {
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ "products": _products.join(',') })
        })
          .then((resp: HttpClientResponse): Promise<any> => {
            console.log("resp", resp);
            return resp.json();
          })
          .then((data: any) => {
            console.log("data", data);
            setStateData(data.value.Table1);
          });
      });
  }
  React.useEffect(() => {
    //getProductsFlag();
    if (props.apiPath !== "") {
      getSecuredProductsFlag();
    }
  }, [productItems]);

  React.useEffect(() => {
    if (typeof stateData !== typeof undefined && stateData.length > 0) {
      const _Ps: any[] = [];
      productItems.forEach(p => {
        _Ps.push({ product: p, stateColor: (stateData.some(s => s.ProductName.trim().toLowerCase() === p.Title.trim().toLowerCase())) ? stateData.filter(s => s.ProductName.trim().toLowerCase() === p.Title.trim().toLowerCase())[0].ProductState : '' });
      });
      setProductDisplayItems(_Ps);
    }
  }, [productItems, stateData]);


  return (
    <>
      <div className={styles.landingPage}>
        <div className={styles.landingCenter}>
          <h2 className={styles.pageHead}>{props.Pagename}</h2>
          <div className={styles.backToLanding}>
            <Image style={{ maxHeight: '20px', cursor: 'pointer' }} src={backbtn}
              onClick={() => { window.location.href = props.context.pageContext.site.absoluteUrl; }}
            />
            &emsp;&emsp;
            <strong>{props.PageHead}</strong>
            <br/>
            
            <span>{props.PageDescription}</span>
          </div>
          <article className={styles.serviceContainer}>
            <div className={styles.searchBox}>
              <aside>
                <TextField placeholder='Search for services' iconProps={iconProps} className={`${styles.productSearch}`} onChange={onChangeTextFieldValue} />
              </aside>
              {buChoices.length > 0 &&
                <aside className={styles.servicefilter}><span className={styles.filterTrigger} onClick={() => { setFilterShow(!filterShow) }}>Filter</span>
                  <div className={filterShow ? `${styles.showFilterPop} ${styles.filterPop}` : styles.filterPop} >
                    <strong>Business Unit</strong>
                    <div>
                      {
                        buChoices.map((buc: any, index: number) => {
                          return (
                            <Checkbox label={`${buc.key}`}
                              onChange={(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) => {
                                buChoices[index].ischecked = isChecked as boolean;
                                filterByBUs();
                              }}
                            />
                          );
                        })
                      }
                    </div>
                  </div>
                </aside>
              }
            </div>
            <div className={`row ${styles.serviceList}`}>
              {
                productDisplayItems.filter(p => JSON.stringify(p).toLocaleLowerCase().indexOf(textFieldValue.toLocaleLowerCase()) >= 0 || textFieldValue === '' || textFieldValue === null || typeof textFieldValue === typeof undefined).map(_ => {
                  return (
                    <div className={`col-xl-4 col-lg-4 col-md-6 ${styles.serviceBox}`}>
                      <div className={`${styles.serviceItem}`} style={{ cursor: 'pointer' }} onClick={() => { onCardSelect(_.product.Id); }}>
                        <input type='hidden' value={`${_.stateColor}`} />
                        <h3 className={styles.itemHead} style={{ color: `${_.stateColor}` }}>{_.product.Title}</h3>
                        {
                          selectedTileFields.map(stf => {
                            return (
                              <div>
                                <TooltipHost
                                  tooltipProps={{
                                    onRenderContent: () => (
                                      <span dangerouslySetInnerHTML={{ __html: getFieldValue(stf, _.product) }}></span>
                                    )
                                  }}
                                >
                                  {stf.Title !== "Description" && <strong>{stf.Title}:</strong>}
                                  <span className={(stf.TypeAsString === "Note") ? `${styles.max5Miltiline}` : ''} dangerouslySetInnerHTML={{ __html: getFieldValue(stf, _.product) }}></span>
                                </TooltipHost>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </article>
        </div>
      </div>

      <Dialog
        hidden={hideDialog || dialogItem === null}
        onDismiss={() => { setDialogItemId(0); setDialogItem(null); setHideDialog(true); }}
        modalProps={{
          className: `${styles.dialogContainer}`,
          isBlocking: true
        }}
        minWidth={(window.innerWidth >= 400) ? 600 : 300}
        maxWidth={(window.innerWidth >= 400) ? 600 : 300}
      >
        <div className='container-fluid'>
          <div className='row'>
            {
              dialogItem !== null &&
              <div className={`col-sm-12 col-sx-12 ${styles.productCardHeader}`}
                style={{ color: (stateData.some((p: any) => p.ProductName.trim().toLowerCase() === dialogItem.Title.trim().toLowerCase()) ? stateData.filter((p: any) => p.ProductName.trim().toLowerCase() === dialogItem.Title.trim().toLowerCase())[0].ProductState : '') }}
              >{dialogItem.Title}</div>
            }
            {
              selectedDialogFields.map(stf => {
                return (
                  <div className='col-sm-12 col-sx-12'>
                    <div className='row mt-1 mb-1'>
                      <div className={`col-sm-5 col-sx-5 ${styles.productCardLeft}`}>{stf.Title}</div>
                      <div className={`col-sm-7 col-sx-7 ${styles.productCardRight}`}><div dangerouslySetInnerHTML={{ __html: getFieldValue(stf, dialogItem) }}></div></div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <DialogFooter>
          <DefaultButton text='Close' onClick={() => { setDialogItemId(0); setDialogItem(null); setHideDialog(true); }} />
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default ServiceProducts;