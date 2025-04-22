import Vue from 'vue'
import { querySystemConfig } from "@/api/sysDict";

export function getConfigList() {
    return new Promise((resolve, reject) => {
      querySystemConfig()
            .then(response => {
                if (response.data.code !== 0) return
                let data = response.data.data
                resolve(data)
            })
    })
}
