import * as Fuzzysort from 'fuzzysort';


type ShopConfigArray = {
  name:string,
  shopify:any,
  github:any[]
}[];


export class FuzzySearch {

  private sites: ShopConfigArray = [
    {
      "name": "Max Black",
      "shopify": {
        "shop_name": "max-black-au.myshopify.com",
        "api_key": "b20d4bb494cd6f1e8928adf8cda53d51",
        "password": "ca349d149758ed179fa43200bc920017"
      },
      "github": [
        {
          "repo_name": "Max-Black",
          "repo_url": "https://github.com/Process-Creative/Max-Black.git"
        }
      ]
    },
    {
      "name": "Tropeaka",
      "shopify": {
        "shop_name": "tropeaka.myshopify.com",
        "api_key": "b75ed6c73276d357077495742fed4706",
        "password": "8da0dd1151fdfa1d179f353c5d574c1f"
      },
      "github": [
        {
          "repo_name": "Tropeaka-AU",
          "repo_url": "https://github.com/Process-Creative/Tropeaka-AU.git"
        },
        {
          "repo_name": "Tropeaka-UK",
          "repo_url": "https://github.com/Process-Creative/Tropeaka-UK.git"
        },
        {
          "repo_name": "Tropeaka-US",
          "repo_url": "https://github.com/Process-Creative/Tropeaka-US.git"
        },
        {
          "repo_name": "Tropeaka-2019",
          "repo_url": "https://github.com/Process-Creative/tropeaka-2019.git"
        }
      ]
    },
    {
      "name": "Glo Skin Body",
      "shopify": {
        "shop_name": "glo-skin-body.myshopify.com",
        "api_key": "04922735cc76d6de82b636ed5faa68a4",
        "password": "525283541674cb3f657ec21af8226a1a"
      },
      "github": [
        {
          "repo_name": "glo-skin-body",
          "repo_url": "https://github.com/Process-Creative/glo-skin-body.git"
        }
      ]
    },
    {
      "name": "Helly Hansen AU",
      "shopify": {
        "shop_name": "helly-hansen-au.myshopify.com",
        "api_key": "cdd010f0e0635d74fbbe3331302626ed",
        "password": "c75f5103639cfd5ad9f6beff433ad7ef"
      },
      "github": [
        {
          "repo_name": "helly-hansen-au",
          "repo_url": "https://github.com/Process-Creative/helly-hansen-au.git"
        }
      ]
    },
    {
      "name": "John D Sandbox",
      "shopify": {
        "shop_name": "john-d-sandbox.myshopify.com",
        "api_key": "c2f48bf3cbcbc9573aee0672511e437c",
        "password": "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"
      },
      "github": []
    },
    {
      "name": "steele. label",
      "shopify": {
        "shop_name": "steele-dev.myshopify.com",
        "api_key": "1cdee43c68be15add8cd46bfb96fd277",
        "password": "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"
      },
      "github": [
        {
          "repo_name": "Steele",
          "repo_url": "https://github.com/Process-Creative/Steele.git"
        }
      ]
    },
  ];


  /* Empty Config
  
    {
      "name": "",
      "shopify": {
        "shop_name": "",
        "api_key": "",
        "password": ""
      },
      "github": [
        {
          "repo_name": "",
          "repo_url": ""
        }
      ]
    },
  
  */

  constructor() { }

  public search(searchTerm: string): any {
    let results = Fuzzysort.go(searchTerm, this.sites, { key: 'name' });
    let matches = [];

    for (let result of results) {
      let highlighted = Fuzzysort.highlight(Fuzzysort.single(searchTerm, result.target), '{blue-fg}', '{/blue-fg}');
      matches.push({
        website: highlighted,
        ...results[0].obj.shopify,
        github: results[0].obj.github.length > 0
        ? results[0].obj.github .map(({ repo_url }) => repo_url)
        : []
      });
    }

    return matches;
  }

}
