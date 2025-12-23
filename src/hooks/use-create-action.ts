import { useQueryState } from "nuqs"

const useCreateAction = ({key='action', defaultValue= ""}:{key: string, defaultValue?: string}) => {
  const [value, setValue] = useQueryState(key, {
    defaultValue,
    shallow: false, // IMPORTANT
  })
    return [value, setValue] as const
}

export default useCreateAction