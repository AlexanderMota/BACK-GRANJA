const BaseRepository = require('./base.repository');
const { ObjectId } = require('mongodb');

let _empleado = null;
let _tarea = null;
let _tareaHasEmpleados = null;

module.exports = class EmpleadoRepository extends BaseRepository{
    constructor({Empleado, TareaHasEmpleados, Tarea}){
        super(Empleado);
        _empleado = Empleado;
        _tarea = Tarea;
        _tareaHasEmpleados = TareaHasEmpleados;
    }

    /*async mongoGetAll(pageSize = 5, pageNum = 1) {
        const skips = pageSize * (pageNum - 1);
        return await _empleado
          .find({ 'rol.nombre' : { $ne: 'ADMIN' }}, { "rol.valor": 0, "__v":0, })
          .skip(skips)
          .limit(pageSize);
    }*/
    async mongoGetEmpleadoByIdEmpleado(idEmpleado) {
        return await _empleado.findOne({idEmpleado:idEmpleado});
    }

    async mongoGetEmpleadoByEmail(email) {
        return await _empleado.findOne({email:email});
    }
    async mongoGetEmpleadosByIdTarea(idTarea, pageSize = 5, pageNum = 1) {
        const skips = pageSize * (pageNum - 1);
        const idEmpleados  = await _tareaHasEmpleados.find({idTarea:idTarea});
        
        if(!idEmpleados){
            return false;
        }
        const empleados = [];


        for (var i = 0; i < idEmpleados.length; i++) {
            let emp = await _empleado.find({_id:idEmpleados[i].idEmpleado});
            empleados.push(emp[0]);
        }
        return empleados;
    }
    async mongoGetEmpleadosDisponibles(idSuper, rolBuscar){
        const empleados = await _empleado.find({
            centroTrabajo: idSuper, 
            'rol.nombre': rolBuscar 
        });
        if(!empleados){
            return false;
        }
        return empleados;
    }
    /*async mongoGetAllSolicitudes(pageSize, pageNum,campo={$query: {}, $orderby: { fechasolicitud : 1 }}){
        const sols = await _solicitudRep.mongoGetAll(pageSize, pageNum,campo);
        let listaRes = [];
        for (var i = 0; i < sols.length; i++) {
            let tar = await _tareaRep.mongoGet(sols[i].idTarea);
            let emp = await _empleadoRep.mongoGet(sols[i].idEmpleado);
            
            listaRes.push({"idSolicitud":sols[i]._id.toString(),"tarea":tar,"empleado":emp,"fechaSolicitud":sols[i].fechaSolicitud})
            //console.log(listaRes[i]);
        }
        return listaRes;
    }*/
    async mongoDelete(idEmpleado) {
        await _tareaHasEmpleados.deleteMany({idEmpleado:idEmpleado});
        return await _empleado.findByIdAndDelete(idEmpleado);
    }
}

