import { createApp } from 'https://unpkg.com/petite-vue?module'

function Address () {
  return {
    regions: [],
    region: '',
    provinces: [],
    province: '',
    municipalities: [],
    municipality: '',
    barangays: [],
    barangay: '',
    mounted () {
      this.getRegions()
    },
    getProvinces () {
      axios.get('https://psgc-api.wareneutron.com/api/province').
        then(response => {
          console.log(response.data[0].province)
          this.provinces = response.data[0].province
        })
    },
    getRegions () {
      axios.get('https://psgc-api.wareneutron.com/api/region').
        then(response => {
          console.log(response.data.data[0].region)
          this.regions = response.data.data[0].region
        })
    },
  }
}

function Payment () {
  return {
    has_error: false,
    paymentParticulars: [
      'Tuition Fee',
      'Rental',
      'Registrar Fees',
      'Other school fees',
    ],
    paymentParticular: '',
    paymentParticularType: '',
    rental2: false,
    rentalCount: 0,
    total: 0,
    paymentAmount: null,
    rentalAmount1: 0,
    rentalAmount2: 0,
    rentalAmount3: 0,
    rentalAmount4: 0,
    rentalAmount5: 0,
    rentalTotalAmount: 0,
    paymentMethod: '',
    fee: 22.40,
    fee_2: 0.0224,
    fee_bdo: 28,
    fee_711: 0.035,
    fee_MC: 28,
    nonbank_otc_fee: 0,
    paymentChannels: null,
    paymentChannel: null,
    paymentMethods: [
      /*{
        label: 'Bank OTC',
        code: 'bank_otc',
        channels: [
          {
            label: 'BDO',
            code: 'bdo_ph',
          },
          {
            label: 'Unionbank',
            code: 'ubp_ph',
          },
          {
            label: 'PNB',
            code: 'pnb_ph',
          },
          {
            label: 'UCPB',
            code: 'ucpb_ph',
          },
        ],
      },
      {
        label: 'Non-Bank OTC',
        code: 'nonbank_otc',
        channels: [
          {
            label: 'EC Pay',
            code: 'ecpay_ph',
          },
        ],
      },
      {
        label: 'Credit Card',
        code: 'creditcard',
        channels: [
          {
            label: 'BDO',
            code: 'bdo_cc_ph',
          },
          {
            label: 'Paymaya',
            code: 'paymaya_cc_ph',
          },
          {
            label: 'Metrobank',
            code: 'metrobank_cc_ph',
          },
          {
            label: 'Union Bank',
            code: 'ubp_ph',
          },
        ],
      },
      {
        label: 'Online Bills Payment',
        code: 'onlinebillspayment',
        channels: [
          {
            label: 'BDO',
            code: 'bdoobp',
          },
          {
            label: 'Union Bank',
            code: 'ubpobp',
          },

        ],
      },*/
      {
        label: 'Online Bank Transfer',
        code: 'onlinebanktransfer',
        fee: 16.80,
        channels: [
          {
            label: 'Bank of the Philippine Islands',
            code: 'bpi_online',

          }, {
            label: 'Union Bank of the Philippines',
            code: 'ubp_online',
          }, {
            label: 'BDO Online Bank Transfer',
            code: 'br_bdo_ph',
          }, {
            label: 'RCBC Online Bank Transfer',
            code: 'br_rcbc_ph',
          }, {
            label: 'PNB Online Bank Transfer',
            code: 'br_pnb_ph',
          },
        ],
      }, {
        label: 'E-Wallets',
        code: 'wallet',
        channels: [
          {
            label: 'Coins PH',
            code: 'coins_ph',
          }, {
            label: 'Paymaya',
            code: 'paymaya_ph',
          }, {
            label: 'Grab Pay',
            code: 'grabpay_ph',
          }, {
            label: 'GCash',
            code: 'gc',
          },
        ],
      }, {
        label: 'Non-Bank OTC',
        code: 'nonbank_otc',
        channels: [
          {
            label: 'DragonPay',
            code: 'dp_ph',
          }, {
            label: '711 Cliqq Network',
            code: 'cliqq_ph',
          }, {
            label: '711',
            code: '711_ph',
          }, {
            label: 'Mlhuillier Pawnshop',
            code: 'mlhuillier_ph',
          }, {
            label: 'Cebuana Pawnshop',
            code: 'cebuana_ph',
          }, {
            label: 'Direct Agents 5',
            code: 'da5_ph',
          }, {
            label: 'SM Bills Payment',
            code: 'smbills_ph',
          }, {
            label: 'True Money',
            code: 'truemoney_ph',
          }, {
            label: 'Possible.net',
            code: 'posible_ph',
          }, {
            label: 'Expresspay',
            code: 'expresspay_ph',
          }, {
            label: 'Etap',
            code: 'etap_ph',
          },
        ],
      },
    ],

    resetTotal () {
      this.paymentAmount = null
      this.rentalAmount1 = 0
      this.rentalAmount2 = 0
      this.rentalAmount3 = 0
      this.rentalAmount4 = 0
      this.rentalAmount5 = 0
      this.total = 0
    },

    computeRentalTotal () {
      let rentalAmount1 = parseFloat(this.rentalAmount1)
      let rentalAmount2 = parseFloat(this.rentalAmount2)
      let rentalAmount3 = parseFloat(this.rentalAmount3)
      let rentalAmount4 = parseFloat(this.rentalAmount4)

      if (this.rentalCount === 0) {
        this.paymentAmount = rentalAmount1
      } else if (this.rentalCount === 1) {
        this.paymentAmount = rentalAmount1 + rentalAmount2
      } else if (this.rentalCount === 2) {
        this.paymentAmount = rentalAmount1 + rentalAmount2 + rentalAmount3
      } else if (this.rentalCount === 3) {
        this.paymentAmount = rentalAmount1 + rentalAmount2 + rentalAmount3 +
          rentalAmount4
      } else if (this.rentalCount === 4) {
        this.paymentAmount = rentalAmount1 + rentalAmount2 + rentalAmount3 +
          rentalAmount4 + rentalAmount4
      }

      this.computeTotal()

    },

    checkMinimumAmount() {
      let paymentAmount = parseFloat(this.paymentAmount || 0)
      if (paymentAmount < 100) {
        console.log('set to null')
        this.paymentAmount = null
      }
    },

    computeTotal () {
      let paymentAmount = parseFloat(this.paymentAmount || 0)
      this.has_error = paymentAmount < 100
      this.checkMinimumAmount()
      if (this.total !== null) {
        let fee = this.fee
        let fee_2 = paymentAmount * this.fee_2
        if (this.paymentMethod !== '') {
          if (this.paymentMethod === 'onlinebanktransfer' ||
            this.paymentMethod === 'wallet') {
            if (this.paymentChannel === 'br_bdo_ph') {
              this.total = paymentAmount + this.fee_bdo
            } else if (this.paymentChannel === 'br_rcbc_ph' ||
              this.paymentChannel === 'br_pnb_ph') {
              this.total = paymentAmount + this.fee
            } else {
              if (fee > fee_2) {
                this.total = paymentAmount + fee
              } else {
                this.total = paymentAmount + fee_2
              }
            }
          }
          if (this.paymentMethod === 'nonbank_otc') {
            if (this.paymentChannel === 'mlhuillier_ph' ||
              this.paymentChannel === 'cebuana_ph') {
              this.total = paymentAmount + this.fee_MC
            } else if (this.paymentChannel === '711_ph') {
              let fee_711 = paymentAmount * this.fee_711
              this.total = paymentAmount + fee_711
            } else {
              this.total = paymentAmount + fee
            }
          }
        }
      }
    },
    // methods
    getPaymentChannels () {
      this.paymentMethods.forEach((obj, i) => {
        console.log(this.paymentMethod)
        if (obj.code === this.paymentMethod) {
          this.paymentChannels = obj.channels
        }
      })
      console.log(this.rentalTotalAmount, this.paymentParticular)

      this.computeTotal()
    },
    mounted () {
      this.computeTotal()
    },

    addRental () {
      this.rentalCount = this.rentalCount + 1

      this.computeRentalTotal()
    },
    removeRental () {
      this.rentalCount = this.rentalCount - 1

      this.computeRentalTotal()
    },
  }
}

createApp({
  Address,
  Payment,
  $delimiters: ['$[[', ']]'],
}).mount()
